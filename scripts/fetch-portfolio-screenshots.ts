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

  const provider = process.env.SCREENSHOT_PROVIDER || 'thumio';
  const apiKey = process.env.SCREENSHOT_API_KEY || '';

  function providerUrlFor(siteUrl: string) {
    switch (provider.toLowerCase()) {
      case 'apiflash':
        if (!apiKey) throw new Error('APIFLASH requires SCREENSHOT_API_KEY');
        return `https://api.apiflash.com/v1/urltoimage?access_key=${encodeURIComponent(apiKey)}&format=png&width=1200&height=720&url=${encodeURIComponent(siteUrl)}`;
      case 'screenshotapi':
        if (!apiKey) throw new Error('SCREENSHOTAPI requires SCREENSHOT_API_KEY');
        return `https://api.screenshotapi.net/screenshot?token=${encodeURIComponent(apiKey)}&url=${encodeURIComponent(siteUrl)}&full_page=false&width=1200&height=720&output=image&file_type=png`;
      case 'thumio':
      default:
        return `https://image.thum.io/get/width/1200/crop/720/${encodeURIComponent(siteUrl)}`;
    }
  }

  for (const p of projects) {
    try {
      console.log(`Processing ${p.url}`);
      // Try configured screenshot service first for a full-size image
      const dest = path.join(outDir, `${p.id}.png`);
      try {
        const svcUrl = providerUrlFor(p.url);
        await download(svcUrl, dest);
        console.log(`Saved screenshot ${dest} from ${svcUrl}`);
        continue;
      } catch (e: any) {
        console.warn(`Screenshot service (${provider}) failed for ${p.url}: ${e.message}. Falling back to OG/favicons`);
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
