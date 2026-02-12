import { load, CheerioAPI } from 'cheerio';

export function parseHtml(html: string): CheerioAPI {
  return load(html);
}
