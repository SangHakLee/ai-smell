import { CheerioAPI } from 'cheerio';
import { BaseSniffer } from './base';
import { SniffResult } from '../types';

export class DesignSniffer extends BaseSniffer {
  constructor() {
    super('Design');
  }

  sniff(cheerio: CheerioAPI): SniffResult {
    let score = 0;
    const messages: string[] = [];

    const hasFlex = this.usesFlexbox(cheerio);
    const hasGrid = this.usesGrid(cheerio);

    if (!hasFlex && !hasGrid) {
      score += 0.5;
      messages.push('Layout seems to be using older techniques (tables or floats), which might indicate a template.');
    }

    const imageCount = cheerio('img').length;
    const svgCount = cheerio('svg').length;

    if (imageCount + svgCount < 2) {
      score += 0.3;
      messages.push('Very few images or SVGs used, suggesting a low-effort design.');
    }

    if (messages.length === 0) {
      return this.createResult(0, 'Layout seems modern and uses sufficient media.');
    }

    return this.createResult(Math.min(score, 1.0), messages.join(' '));
  }

  private usesFlexbox(cheerio: CheerioAPI): boolean {
    let flexFound = false;
    cheerio('*').each((i, el) => {
      const style = cheerio(el).attr('style');
      if (style && /display:\s*flex/i.test(style)) {
        flexFound = true;
        return false;
      }
    });
    return flexFound;
  }

  private usesGrid(cheerio: CheerioAPI): boolean {
    let gridFound = false;
    cheerio('*').each((i, el) => {
      const style = cheerio(el).attr('style');
      if (style && /display:\s*grid/i.test(style)) {
        gridFound = true;
        return false;
      }
    });
    return gridFound;
  }
}
