import { CheerioAPI } from 'cheerio';
import { BaseSniffer } from './base';
import { SniffResult } from '../types';

export class UiKitSniffer extends BaseSniffer {
  constructor() {
    super('UIKit');
  }

  sniff(cheerio: CheerioAPI): SniffResult {
    if (cheerio('link[href*="bootstrap"]').length > 0) {
      if(this.hasCustomCss(cheerio)) {
        return this.createResult(0.2, 'Bootstrap detected, but custom styles are applied.');
      }
      return this.createResult(0.7, 'Default Bootstrap CSS seems to be used.');
    }

    if (cheerio('style[id*="Mui"]').length > 0) {
      if(this.hasCustomCss(cheerio)) {
          return this.createResult(0.2, 'Material-UI detected, but custom styles are applied.');
      }
      return this.createResult(0.6, 'Default Material-UI styles seem to be used.');
    }
    
    return this.createResult(0, 'No common UI kits detected.');
  }

  private hasCustomCss(cheerio: CheerioAPI): boolean {
    let customStyles = false;
    cheerio('link[rel="stylesheet"]').each((i, el) => {
        const href = cheerio(el).attr('href');
        if(href && !href.includes('bootstrap') && !href.includes('material')) {
            customStyles = true;
            return false; // break
        }
    });
    return customStyles || cheerio('style').length > 1; // more than just the MUI style tag
  }
}