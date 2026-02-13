import { CheerioAPI } from 'cheerio';
import { BaseSniffer } from './base';
import { SniffResult } from '../types';

/**
 * AI service default domains.
 * Using these domains without custom domain is almost 100% proof of AI-generated site.
 */
export const AI_SERVICE_DOMAINS = [
  // Lovable (GPT Engineer) - AI website builder
  'lovable.app',
  'lovable.dev',
  'gptengineer.app',

  // Base44 - AI deployment platform
  'base44.app',
  'base44.dev',

  // Vercel v0 - AI UI generator
  'v0.dev',
  'vercel.app', // Vercel's default deployment domain

  // Bolt.new - StackBlitz AI
  'bolt.new',
  'stackblitz.io',

  // Replit - AI coding platform
  'replit.app',
  'replit.dev',
  'repl.co',

  // Netlify - popular for AI-generated sites
  'netlify.app',

  // GitHub Pages (often used for AI projects)
  'github.io',

  // Cloudflare Pages
  'pages.dev',

  // Render
  'onrender.com',

  // Railway
  'railway.app',
  'up.railway.app',

  // Fly.io
  'fly.dev',

  // Surge.sh
  'surge.sh',

  // Glitch
  'glitch.me',

  // CodeSandbox
  'codesandbox.io',
  'csb.app',

  // Heroku
  'herokuapp.com',

  // Webflow (no-code/AI builder)
  'webflow.io',

  // Framer (AI-assisted design tool)
  'framer.website',
  'framer.app',

  // Wix (AI builder)
  'wixsite.com',
  'wix.com',

  // Squarespace
  'squarespace.com',

  // Webnode
  'webnode.com',

  // Weebly
  'weebly.com',

  // Site123
  'site123.me',

  // Carrd
  'carrd.co',

  // Bubble.io (no-code platform)
  'bubbleapps.io',

  // Softr
  'softr.app',

  // Tilda
  'tilda.ws',

  // 000webhost
  '000webhostapp.com',

  // Firebase hosting
  'web.app',
  'firebaseapp.com',
];

/**
 * High-confidence AI builder domains (almost certainly AI-generated)
 */
export const HIGH_CONFIDENCE_AI_DOMAINS = [
  'lovable.app',
  'lovable.dev',
  'gptengineer.app',
  'base44.app',
  'base44.dev',
  'v0.dev',
  'bolt.new',
];

/**
 * Medium-confidence domains (often used for AI projects, but not exclusively)
 */
export const MEDIUM_CONFIDENCE_DOMAINS = [
  'vercel.app',
  'netlify.app',
  'replit.app',
  'replit.dev',
  'repl.co',
  'pages.dev',
  'github.io',
];

/**
 * Detects if a website is hosted on an AI service's default domain
 */
export class DomainSniffer extends BaseSniffer {
  constructor() {
    super('Domain');
  }

  sniff(cheerio: CheerioAPI, url?: string): SniffResult {
    // Try to get URL from parameter first, then from meta tags
    if (!url) {
      url = cheerio('link[rel="canonical"]').attr('href') ||
            cheerio('meta[property="og:url"]').attr('content') ||
            '';
    }

    if (!url) {
      return this.createResult(0, 'Cannot determine domain');
    }

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      // Check high-confidence AI domains
      for (const domain of HIGH_CONFIDENCE_AI_DOMAINS) {
        if (hostname.endsWith(domain)) {
          return this.createResult(
            1.0,
            `🎯 DEFINITIVE: Hosted on AI builder domain: ${domain} (almost certainly AI-generated)`
          );
        }
      }

      // Check medium-confidence domains
      for (const domain of MEDIUM_CONFIDENCE_DOMAINS) {
        if (hostname.endsWith(domain)) {
          return this.createResult(
            0.7,
            `Hosted on popular AI deployment platform: ${domain}`
          );
        }
      }

      // Check all AI service domains
      for (const domain of AI_SERVICE_DOMAINS) {
        if (hostname.endsWith(domain)) {
          return this.createResult(
            0.8,
            `Hosted on AI/no-code platform: ${domain}`
          );
        }
      }

      return this.createResult(0, `Custom domain: ${hostname}`);

    } catch (err) {
      return this.createResult(0, 'Invalid URL in meta tags');
    }
  }
}
