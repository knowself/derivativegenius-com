import { marked } from 'marked';

/**
 * Render Markdown string to safe HTML.
 */
export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  if (!markdown) return '';
  const result = await marked.parse(markdown, {
    gfm: true,
    breaks: true,
  });
  return result;
}

/**
 * Estimate reading time in minutes based on 200 words per minute.
 */
export function estimateReadingTime(text: string): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
