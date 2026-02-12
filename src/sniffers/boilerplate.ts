import { CheerioAPI } from 'cheerio';
import { BaseSniffer } from './base';
import { SniffResult } from '../types';

export class BoilerplateSniffer extends BaseSniffer {
  constructor() {
    super('Boilerplate');
  }

  sniff(cheerio: CheerioAPI): SniffResult {
    const title = cheerio('title').text();
    if (/^React App$/i.test(title)) {
      return this.createResult(0.9, 'Default "React App" title found.');
    }

    const bodyText = cheerio('body').text();
    if (/This site was created with/i.test(bodyText)) {
      return this.createResult(0.8, 'Contains "This site was created with..." text.');
    }

    return this.createResult(0, 'No obvious framework boilerplate found.');
  }
}