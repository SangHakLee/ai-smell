import { CheerioAPI } from 'cheerio';
import { BaseSniffer } from './base';
import { SniffResult } from '../types';

/**
 * Common AI-generated tech stack combinations
 */
export const AI_TECH_STACKS = {
  // The "AI Starter Pack" - extremely common in AI-generated projects
  nextjs: ['__next', '_next/', 'next.js', '__NEXT_DATA__'],
  tailwind: [
    'tailwindcss',
    'class=".*?\\b(flex|grid|p-\\d|m-\\d|bg-|text-|rounded|shadow)\\b',
    '--tw-',
    'tailwind'
  ],
  supabase: [
    'supabase',
    '.supabase.co',
    'supabase-client',
    'sb-'
  ],
  vercel: [
    'vercel.app',
    '_vercel',
    'vercel-insights',
    'va/script.js'
  ],
  shadcn: [
    'shadcn',
    'class=".*?\\b(cn\\()',
    'radix-ui',
    '@radix-ui'
  ],
  react: [
    'react',
    '__react',
    'data-reactroot',
    'data-reactid'
  ],
  vite: [
    '/assets/index-[a-zA-Z0-9]+\\.js',
    'type="module".*?crossorigin',
    'vite'
  ]
};

/**
 * Detects common AI-generated tech stack combinations
 */
export class TechStackSniffer extends BaseSniffer {
  constructor() {
    super('TechStack');
  }

  sniff(cheerio: CheerioAPI, url?: string): SniffResult {
    let score = 0;
    const messages: string[] = [];
    const detectedTech: string[] = [];

    const html = cheerio.html();

    // Check for Next.js
    if (this.detectTech(html, cheerio, AI_TECH_STACKS.nextjs)) {
      detectedTech.push('Next.js');
    }

    // Check for Tailwind CSS
    if (this.detectTech(html, cheerio, AI_TECH_STACKS.tailwind)) {
      detectedTech.push('Tailwind CSS');
    }

    // Check for Supabase
    if (this.detectTech(html, cheerio, AI_TECH_STACKS.supabase)) {
      detectedTech.push('Supabase');
    }

    // Check for Vercel
    if (this.detectTech(html, cheerio, AI_TECH_STACKS.vercel) || url?.includes('vercel.app')) {
      detectedTech.push('Vercel');
    }

    // Check for shadcn/ui (very popular in AI projects)
    if (this.detectTech(html, cheerio, AI_TECH_STACKS.shadcn)) {
      detectedTech.push('shadcn/ui');
    }

    // Check for React
    if (this.detectTech(html, cheerio, AI_TECH_STACKS.react)) {
      detectedTech.push('React');
    }

    // Check for Vite
    if (this.detectTech(html, cheerio, AI_TECH_STACKS.vite)) {
      detectedTech.push('Vite');
    }

    // Score based on the "AI Starter Pack" combination
    const hasNextJS = detectedTech.includes('Next.js');
    const hasTailwind = detectedTech.includes('Tailwind CSS');
    const hasSupabase = detectedTech.includes('Supabase');
    const hasVercel = detectedTech.includes('Vercel');
    const hasShadcn = detectedTech.includes('shadcn/ui');

    // The classic AI combo: Next.js + Tailwind + Supabase/Vercel
    if (hasNextJS && hasTailwind && hasSupabase) {
      score += 0.9;
      messages.push('🎯 Classic AI stack: Next.js + Tailwind + Supabase');
    } else if (hasNextJS && hasTailwind && hasVercel) {
      score += 0.8;
      messages.push('AI-favorite stack: Next.js + Tailwind + Vercel');
    } else if (hasNextJS && hasTailwind) {
      score += 0.6;
      messages.push('Common AI stack: Next.js + Tailwind CSS');
    }

    // shadcn/ui is extremely popular in AI-generated projects
    if (hasShadcn && (hasNextJS || hasTailwind)) {
      score += 0.4;
      messages.push('shadcn/ui detected (very popular in AI projects)');
    }

    // Vite + React + Tailwind (alternative AI stack)
    const hasVite = detectedTech.includes('Vite');
    const hasReact = detectedTech.includes('React');

    if (hasVite && hasReact && hasTailwind) {
      score += 0.6;
      messages.push('Vite + React + Tailwind (common AI template)');
    } else if (hasVite && hasTailwind) {
      score += 0.4;
      messages.push('Vite + Tailwind (popular AI quick-start)');
    }

    // Just Tailwind is very common in AI projects
    if (hasTailwind && score === 0) {
      score += 0.2;
      messages.push('Tailwind CSS detected (very popular in AI projects)');
    }

    // Additional points for tech diversity (AI tools love using many libraries)
    if (detectedTech.length >= 5) {
      score += 0.2;
      messages.push(`Uses ${detectedTech.length} modern frameworks (AI tendency to over-engineer)`);
    } else if (detectedTech.length >= 3) {
      score += 0.1;
    }

    score = Math.min(score, 1.0);

    if (detectedTech.length > 0) {
      messages.push(`Detected: ${detectedTech.join(', ')}`);
    }

    if (messages.length === 0) {
      return this.createResult(0, 'No common AI tech stack patterns detected');
    }

    return this.createResult(parseFloat(score.toFixed(2)), messages.join('; '));
  }

  /**
   * Check if any pattern matches in the HTML
   */
  private detectTech(html: string, cheerio: CheerioAPI, patterns: string[]): boolean {
    for (const pattern of patterns) {
      try {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(html)) {
          return true;
        }
      } catch (e) {
        // If regex is invalid, try simple includes
        if (html.toLowerCase().includes(pattern.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  }
}
