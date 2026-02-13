import { CheerioAPI } from 'cheerio';
import { BaseSniffer } from './base';
import { SniffResult } from '../types';

export class BoilerplateSniffer extends BaseSniffer {
  constructor() {
    super('Boilerplate');
  }

  sniff(cheerio: CheerioAPI): SniffResult {
    let score = 0;
    const messages: string[] = [];

    const title = cheerio('title').text();
    if (/^React App$/i.test(title)) {
      score += 0.9;
      messages.push('Default "React App" title found.');
    }

    const bodyText = cheerio('body').text().trim();
    if (/This site was created with/i.test(bodyText)) {
      score += 0.8;
      messages.push('Contains "This site was created with..." text.');
    }

    // Check for SPA boilerplate (empty body with just root div)
    const bodyHTML = cheerio('body').html() || '';
    const hasOnlyRootDiv = /<div\s+id=["']root["']>\s*<\/div>/i.test(bodyHTML);
    const hasOnlyAppDiv = /<div\s+id=["']app["']>\s*<\/div>/i.test(bodyHTML);

    if (hasOnlyRootDiv || hasOnlyAppDiv) {
      score += 0.6;
      messages.push('Empty SPA skeleton (just root div, content likely AI-generated)');
    }

    // Check for Vite build artifacts
    const scripts = cheerio('script[src]');
    let viteDetected = false;
    scripts.each((_, el) => {
      const src = cheerio(el).attr('src') || '';
      if (/\/assets\/index-[a-zA-Z0-9]+\.js/i.test(src)) {
        viteDetected = true;
      }
    });

    const links = cheerio('link[href]');
    links.each((_, el) => {
      const href = cheerio(el).attr('href') || '';
      if (/\/assets\/index-[a-zA-Z0-9]+\.css/i.test(href)) {
        viteDetected = true;
      }
    });

    if (viteDetected) {
      score += 0.4;
      messages.push('Vite default build structure detected (common in AI-scaffolded projects)');
    }

    // Check for minimal HTML structure (typical of AI-generated SPAs)
    const htmlContent = cheerio('html').html() || '';
    const lineCount = htmlContent.split('\n').length;

    if (lineCount < 50 && (hasOnlyRootDiv || hasOnlyAppDiv)) {
      score += 0.3;
      messages.push('Minimal HTML structure (AI-generated boilerplate)');
    }

    // Check for default favicon patterns
    const favicon = cheerio('link[rel="icon"]').attr('href') || '';
    if (favicon.includes('logo') && favicon.includes('.png')) {
      score += 0.15;
      messages.push('Generic logo favicon');
    }

    score = Math.min(score, 1.0);

    if (messages.length === 0) {
      return this.createResult(0, 'No obvious framework boilerplate found.');
    }

    return this.createResult(parseFloat(score.toFixed(2)), messages.join('; '));
  }
}