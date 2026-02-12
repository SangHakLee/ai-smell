import { CheerioAPI } from 'cheerio';
import { BaseSniffer } from './base';
import { SniffResult } from '../types';

export class MetaSniffer extends BaseSniffer {
  constructor() {
    super('Meta');
  }

  sniff(cheerio: CheerioAPI): SniffResult {
    const generator = cheerio('meta[name="generator"]').attr('content');

    if (generator) {
      if (/wix|squarespace|godaddy/i.test(generator)) {
        return this.createResult(0.8, `Site made with a generic builder: ${generator}`);
      }
      if (/ai|copilot|gemini/i.test(generator)) {
        return this.createResult(1.0, `Generator tag explicitly mentions AI: ${generator}`);
      }
    }

    const description = cheerio('meta[name="description"]').attr('content') || '';
    if (description.length < 50 && description.length > 10) {
        return this.createResult(0.3, `Meta description is very short, possibly a default.`);
    }


    return this.createResult(0, 'No specific AI-related meta tags found.');
  }
}
