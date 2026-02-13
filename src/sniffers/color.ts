import { CheerioAPI } from 'cheerio';
import { BaseSniffer } from './base';
import { SniffResult } from '../types';

/**
 * Detects color palettes commonly used by AI-generated websites.
 * AI tools often default to specific trendy colors or safe color combinations.
 */
export class ColorPaletteSniffer extends BaseSniffer {
  constructor() {
    super('ColorPalette');
  }

  // Common AI-generated website color patterns
  private readonly aiCommonColors = {
    // Vibrant oranges/corals (very popular in AI templates)
    oranges: ['#ff6b6b', '#ff8c42', '#ff9f1c', '#ff7733', '#f77f00', '#fd7e14', '#ff6347'],

    // Purple/violet gradients (trendy in AI-generated SaaS sites)
    purples: ['#6c5ce7', '#a29bfe', '#7c3aed', '#8b5cf6', '#9d4edd', '#b388ff', '#7c4dff'],

    // Specific blue shades (AI defaults) - #0061FF and #0052D9 are EXTREMELY common in AI tools
    blues: ['#0061FF', '#0052D9', '#0066ff', '#0080ff', '#00a8ff', '#3498db', '#4a90e2', '#5e60ce', '#2196f3', '#1890ff'],

    // Trendy teals/cyans
    teals: ['#00d4aa', '#1abc9c', '#16a085', '#00b4d8', '#48cae4', '#06ffa5'],

    // Gradient combinations (rgba format often used inline)
    gradientIndicators: ['linear-gradient', 'radial-gradient', 'rgba(']
  };

  sniff(cheerio: CheerioAPI): SniffResult {
    let score = 0;
    const messages: string[] = [];
    const foundColors = new Set<string>();

    // Check inline styles
    cheerio('*[style]').each((_, el) => {
      const style = cheerio(el).attr('style') || '';
      this.analyzeStyle(style, foundColors);
    });

    // Check style tags
    cheerio('style').each((_, el) => {
      const styleContent = cheerio(el).html() || '';
      this.analyzeStyle(styleContent, foundColors);
    });

    // Check for gradient usage (very common in AI templates)
    const hasGradients = cheerio('*').toArray().some(el => {
      const style = cheerio(el).attr('style') || '';
      return /linear-gradient|radial-gradient/i.test(style);
    }) || cheerio('style').html()?.includes('gradient') || false;

    if (hasGradients) {
      score += 0.2;
      messages.push('Uses CSS gradients (common in AI templates)');
    }

    // Count matches for each color family
    const colorMatches = {
      oranges: this.countColorMatches(foundColors, this.aiCommonColors.oranges),
      purples: this.countColorMatches(foundColors, this.aiCommonColors.purples),
      blues: this.countColorMatches(foundColors, this.aiCommonColors.blues),
      teals: this.countColorMatches(foundColors, this.aiCommonColors.teals)
    };

    // Check for specific AI color combinations
    if (colorMatches.oranges >= 2) {
      score += 0.3;
      messages.push('Multiple vibrant orange/coral colors detected (AI template signature)');
    } else if (colorMatches.oranges === 1) {
      score += 0.15;
      messages.push('Found trendy orange color commonly used in AI templates');
    }

    if (colorMatches.purples >= 2) {
      score += 0.25;
      messages.push('Purple gradient palette detected (popular in AI SaaS templates)');
    }

    if (colorMatches.teals >= 2) {
      score += 0.2;
      messages.push('Teal/cyan color scheme (trendy AI default)');
    }

    // Check for "safe" color combinations AI often uses
    const colorFamiliesUsed = Object.values(colorMatches).filter(count => count > 0).length;
    if (colorFamiliesUsed >= 3) {
      score += 0.25;
      messages.push('Uses multiple trendy color families (AI-like color diversity)');
    }

    // Check for very specific hex codes that AI tools love
    const exactAIColors = ['#0061ff', '#0052d9', '#ff6b6b', '#6c5ce7', '#0066ff', '#00d4aa', '#ff9f1c'];
    const exactMatches = exactAIColors.filter(color =>
      Array.from(foundColors).some(found => found.toLowerCase() === color)
    );

    if (exactMatches.length >= 2) {
      score += 0.3;
      messages.push(`Exact AI template colors detected: ${exactMatches.join(', ')}`);
    } else if (exactMatches.length === 1) {
      score += 0.2;
      messages.push(`Found exact AI-favorite color: ${exactMatches[0]}`);
    }

    // Special check for #0061FF specifically (VERY common in AI-generated sites)
    if (Array.from(foundColors).some(c => c.toLowerCase() === '#0061ff')) {
      score += 0.2;
      messages.push('#0061FF detected (signature AI/Cursor IDE color)');
    }

    score = Math.min(score, 1.0);

    if (messages.length === 0) {
      return this.createResult(0, 'Color palette does not match common AI-generated patterns');
    }

    return this.createResult(
      parseFloat(score.toFixed(2)),
      messages.join('; ')
    );
  }

  /**
   * Extract and analyze colors from a style string
   */
  private analyzeStyle(style: string, foundColors: Set<string>): void {
    // Match hex colors
    const hexColors = style.match(/#[0-9a-f]{6}|#[0-9a-f]{3}/gi) || [];
    hexColors.forEach(color => foundColors.add(color.toLowerCase()));

    // Match rgb/rgba colors and convert to approximate hex for comparison
    const rgbColors = style.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi) || [];
    rgbColors.forEach(rgb => {
      const match = rgb.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
      if (match) {
        const [r, g, b] = match;
        const hex = this.rgbToHex(parseInt(r), parseInt(g), parseInt(b));
        foundColors.add(hex);
      }
    });
  }

  /**
   * Convert RGB to hex
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Count how many colors from the found set match a given color family
   */
  private countColorMatches(foundColors: Set<string>, targetColors: string[]): number {
    return targetColors.filter(target =>
      Array.from(foundColors).some(found => this.colorsAreSimilar(found, target))
    ).length;
  }

  /**
   * Check if two hex colors are similar (within a threshold)
   */
  private colorsAreSimilar(color1: string, color2: string): boolean {
    // Exact match
    if (color1.toLowerCase() === color2.toLowerCase()) {
      return true;
    }

    // Parse hex to RGB
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return false;

    // Calculate color distance (simple Euclidean distance)
    const distance = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );

    // Consider similar if within 30 units (out of ~441 max distance)
    return distance < 30;
  }

  /**
   * Convert hex to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}
