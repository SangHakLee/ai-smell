import { CheerioAPI } from 'cheerio';
import { BaseSniffer } from './base';
import { SniffResult } from '../types';

export class MetaSniffer extends BaseSniffer {
  constructor() {
    super('Meta');
  }

  sniff(cheerio: CheerioAPI): SniffResult {
    let score = 0;
    const messages: string[] = [];

    // Check for AI builder signatures
    const author = cheerio('meta[name="author"]').attr('content') || '';
    if (/lovable|v0|bolt|vercel|cursor/i.test(author)) {
      score += 1.0;
      messages.push(`AI builder detected in author tag: ${author}`);
    }

    const generator = cheerio('meta[name="generator"]').attr('content');

    if (generator) {
      if (/wix|squarespace|godaddy/i.test(generator)) {
        score += 0.8;
        messages.push(`Site made with a generic builder: ${generator}`);
      }
      if (/ai|copilot|gemini|lovable|v0|bolt/i.test(generator)) {
        score += 1.0;
        messages.push(`Generator tag explicitly mentions AI: ${generator}`);
      }
    }

    const description = cheerio('meta[name="description"]').attr('content') || '';

    // Check for AI builder placeholder descriptions
    if (/generated project|placeholder|todo|example|your (app|site|project)/i.test(description)) {
      score += 0.9;
      messages.push(`Meta description contains AI placeholder text: "${description}"`);
    }

    // Check for AI-generated description patterns
    if (description.length > 0) {
      const aiPhrases = [
        'designed for',
        'offering a clean',
        'intuitive interface',
        'powerful features',
        'quick workflows',
        'seamless experience',
        'cutting-edge',
        'state-of-the-art',
        'comprehensive solution',
        'robust platform',
        'elevate your',
        'streamline your',
        'empower'
      ];

      let aiPhraseCount = 0;
      const lowerDesc = description.toLowerCase();

      for (const phrase of aiPhrases) {
        if (lowerDesc.includes(phrase)) {
          aiPhraseCount++;
        }
      }

      if (aiPhraseCount >= 3) {
        score += 0.7;
        messages.push(`Meta description contains ${aiPhraseCount} AI-typical marketing phrases`);
      } else if (aiPhraseCount >= 2) {
        score += 0.4;
        messages.push(`Meta description has ${aiPhraseCount} generic marketing phrases`);
      }

      // Check for overly long, perfectly structured descriptions
      if (description.length > 120 && description.length < 160 && aiPhraseCount > 0) {
        score += 0.2;
        messages.push('Meta description is SEO-optimized length with marketing speak');
      }

      // Very short descriptions
      if (description.length < 50 && description.length > 10 && aiPhraseCount === 0) {
        score += 0.3;
        messages.push('Meta description is very short, possibly a default');
      }
    }

    // Check OG description too
    const ogDescription = cheerio('meta[property="og:description"]').attr('content') || '';
    if (ogDescription === description && description.length > 100) {
      score += 0.1;
      messages.push('OG description is identical copy (possible auto-generation)');
    }

    score = Math.min(score, 1.0);

    if (messages.length === 0) {
      return this.createResult(0, 'No specific AI-related meta tags found.');
    }

    return this.createResult(parseFloat(score.toFixed(2)), messages.join('; '));
  }
}
