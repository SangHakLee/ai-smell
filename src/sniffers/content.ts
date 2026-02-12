import { CheerioAPI } from 'cheerio';
import { BaseSniffer } from './base';
import { SniffResult } from '../types';

// A very simplistic check for "AI content"
export class ContentSniffer extends BaseSniffer {
  constructor() {
    super('Content');
  }

  sniff(cheerio: CheerioAPI): SniffResult {
    const text = cheerio('p').text();
    const sentences = text.split('.').filter(s => s.trim().length > 5);
    
    if (sentences.length < 3) {
      return this.createResult(0.5, 'Very little paragraph content on the page.');
    }

    const commonPhrases = [
      "in today's digital age",
      "harnessing the power",
      "a new era of",
      "it's important to",
      "unlock the potential",
      "revolutionize the"
    ];

    let foundPhrases = 0;
    for (const phrase of commonPhrases) {
      if (text.toLowerCase().includes(phrase)) {
        foundPhrases++;
      }
    }

    if (foundPhrases > 1) {
      const score = Math.min(0.3 + (foundPhrases - 1) * 0.2, 0.9);
      return this.createResult(score, `Found ${foundPhrases} generic, AI-like phrases.`);
    }

    return this.createResult(0, 'Content does not seem to contain overly generic phrases.');
  }
}