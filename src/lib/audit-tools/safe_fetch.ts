import 'server-only';

import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export const MAX_BYTES = 1_000_000;
export const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 3;

export function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return true;
  const [a, b] = parts;
  return (
    a === 10 ||
    a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) ||
    a === 0
  );
}

export function isPublicIPv6(ip: string): boolean {
  const addr = ip.toLowerCase();
  if (addr === '::1' || addr === '::') return false;
  if (addr.startsWith('fe80') || addr.startsWith('fe90') || addr.startsWith('fea') || addr.startsWith('feb'))
    return false;
  if (addr.startsWith('fc') || addr.startsWith('fd')) return false;
  if (addr.startsWith('ff')) return false;
  if (addr.includes('::ffff:')) {
    const v4 = addr.split(':').pop() as string;
    return !(v4.includes('.') ? isPrivateIPv4(v4) : true);
  }
  return addr[0] === '2' || addr[0] === '3';
}

function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, '');
  if (host === 'localhost' || host.endsWith('.localhost')) return true;
  if (host === 'metadata.google.internal') return true;
  if (isIP(host)) {
    if (host.includes(':')) return !isPublicIPv6(host);
    return isPrivateIPv4(host);
  }
  return false;
}

/**
 * Fetch public HTML with SSRF guards. Static text only — never executes site scripts.
 * Throws with a safe message on any refusal or failure. Never logs raw HTML.
 */
export async function fetchPublicHtml(url: string): Promise<{ finalUrl: string; html: string }> {
  let current: URL;
  try {
    current = new URL(url);
  } catch {
    throw new Error(`invalid URL: ${url}`);
  }
  if (current.protocol !== 'http:' && current.protocol !== 'https:') {
    throw new Error(`refused non-http(s) scheme: ${current.protocol}`);
  }
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    if (isBlockedHostname(current.hostname)) {
      throw new Error(`blocked target: ${current.hostname}`);
    }
    const records = await lookup(current.hostname, { all: true });
    for (const record of records) {
      const publicAddr = record.family === 4 ? !isPrivateIPv4(record.address) : isPublicIPv6(record.address);
      if (!publicAddr) {
        throw new Error(`blocked target: ${current.hostname} resolves to a non-public address`);
      }
    }
    const response = await fetch(current.toString(), {
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'user-agent': 'DG-audit-tools/1.0 (read-only site check)' },
    });
    if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
      current = new URL(response.headers.get('location') as string, current);
      if (current.protocol !== 'http:' && current.protocol !== 'https:') {
        throw new Error('redirect to non-http(s) target refused');
      }
      continue;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error('empty response body');
    const chunks: Uint8Array[] = [];
    let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > MAX_BYTES) {
        await reader.cancel();
        throw new Error('response exceeded 1MB cap');
      }
      chunks.push(value);
    }
    return { finalUrl: current.toString(), html: Buffer.concat(chunks).toString('utf8') };
  }
  throw new Error('too many redirects');
}
