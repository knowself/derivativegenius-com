import 'server-only';

import { readFileSync } from 'node:fs';
import path from 'node:path';

export interface StewartQuote {
  quote: string;
  topic: string;
}

/** Minimal RFC-4180 reader (quoted fields, "" escapes, CRLF-safe). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const normalized = text.replace(/\r\n?/g, '\n');
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (quoted) {
      if (char === '"') {
        if (normalized[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

let cached: StewartQuote[] | null = null;

/**
 * Read the Stewart quote bank into memory once per server instance.
 * Skips the header row and any malformed lines.
 */
export function getStewartQuotes(): StewartQuote[] {
  if (cached) return cached;
  const csvPath = path.join(process.cwd(), 'src', 'data', 'mike-stewart-quotes.csv');
  const rows = parseCsv(readFileSync(csvPath, 'utf8'));
  cached = rows
    .slice(1)
    .filter((cells) => cells.length >= 2 && cells[0].trim().length > 0)
    .map((cells) => ({ quote: cells[0].trim(), topic: cells[1].trim() || 'general' }));
  if (cached.length === 0) {
    throw new Error(`No usable quotes found in ${csvPath}`);
  }
  return cached;
}
