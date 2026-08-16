#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import fs from 'fs/promises';
import path from 'path';

const projects = [
  { id: 'spacejanitor', url: 'https://www.spacejanitor.pro/' },
  { id: 'voicegenius', url: 'https://www.voicegeni.us/' },
  { id: 'kerryterry', url: 'https://www.kerryterry.com/' },
  { id: 'microgreensla', url: 'https://www.microgreensla.live/' },
];

async function download(url: string, dest: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buffer);
}

async function findImageFromHtml(html: string, baseUrl: string) {
  const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  if (ogMatch) return new URL(ogMatch[1], baseUrl).toString();
  const twitterMatch = html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i);
  if (twitterMatch) return new URL(twitterMatch[1], baseUrl).toString();
  return null;
}

async function main() {
  const outDir = path.join(process.cwd(), 'public', 'images', 'portfolio');
  await fs.mkdir(outDir, { recursive: true });

  for (const p of projects) {
    try {
      console.log(`Processing ${p.url}`);
      // Try screenshot service (thum.io) first for a full-size image
      const thumbUrl = `https://image.thum.io/get/width/1200/crop/720/${encodeURIComponent(p.url)}`;
      const dest = path.join(outDir, `${p.id}.png`);
      try {
        await download(thumbUrl, dest);
        console.log(`Saved screenshot ${dest} from ${thumbUrl}`);
        continue;
      } catch (e) {
        console.warn(`Screenshot service failed for ${p.url}, falling back to OG/favicons`);
      }

      const res = await fetch(p.url);
      const html = await res.text();
      const imageUrl = (await findImageFromHtml(html, p.url)) || new URL('/favicon.ico', p.url).toString();
      await download(imageUrl, dest);
      console.log(`Saved ${dest} from ${imageUrl}`);
    } catch (e: any) {
      console.error(`Failed to fetch for ${p.id}: ${e.message}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
