import { describe, it, expect } from 'vitest';
import { load } from 'cheerio';
import { DesignSniffer } from '../../src/sniffers/design';

describe('DesignSniffer', () => {
    it('should score high for old layout techniques and few images', () => {
        const html = '<html><body><table><tr><td>Old school</td></tr></table></body></html>';
        const cheerio = load(html);
        const sniffer = new DesignSniffer();
        const result = sniffer.sniff(cheerio);
        expect(result.score).toBe(0.8); // 0.5 for layout + 0.3 for no images
        expect(result.message).toContain('older techniques');
        expect(result.message).toContain('few images');
    });

    it('should not score for modern layout (flexbox) with enough images', () => {
        const html = '<html><body><div style="display: flex;"><img src="a.png"><img src="b.png"></div></body></html>';
        const cheerio = load(html);
        const sniffer = new DesignSniffer();
        const result = sniffer.sniff(cheerio);
        expect(result.score).toBe(0);
        expect(result.message).toContain('modern');
    });

    it('should not score for modern layout (grid) with enough images', () => {
        const html = '<html><body><div style="display: grid;"><img src="a.png"><svg></svg></div></body></html>';
        const cheerio = load(html);
        const sniffer = new DesignSniffer();
        const result = sniffer.sniff(cheerio);
        expect(result.score).toBe(0);
        expect(result.message).toContain('modern');
    });

    it('should score for having very few images, even with modern layout', () => {
        const html = '<html><body><div style="display: flex;"><h1>Hello</h1></div></body></html>';
        const cheerio = load(html);
        const sniffer = new DesignSniffer();
        const result = sniffer.sniff(cheerio);
        expect(result.score).toBe(0.3);
        expect(result.message).toContain('few images');
    });

    it('should score for using old layout techniques, even with enough images', () => {
        const html = '<html><body><img src="a.png"><img src="b.png"></body></html>';
        const cheerio = load(html);
        const sniffer = new DesignSniffer();
        const result = sniffer.sniff(cheerio);
        expect(result.score).toBe(0.5);
        expect(result.message).toContain('older techniques');
    });
});