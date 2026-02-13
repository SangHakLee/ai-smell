import { describe, it, expect } from 'vitest';
import { load } from 'cheerio';
import { MetaSniffer } from '../../src/sniffers/meta';

describe('MetaSniffer', () => {
    it('should detect AI generator tag', () => {
        const html = '<html><head><meta name="generator" content="Lovable AI"></head></html>';
        const cheerio = load(html);
        const sniffer = new MetaSniffer();
        const result = sniffer.sniff(cheerio);
        expect(result.score).toBe(1.0);
        expect(result.message).toBe('Generator tag explicitly mentions AI: Lovable AI');
    });

    it('should detect generic builder tag', () => {
        const html = '<html><head><meta name="generator" content="Wix.com Website Builder"></head></html>';
        const cheerio = load(html);
        const sniffer = new MetaSniffer();
        const result = sniffer.sniff(cheerio);
        expect(result.score).toBe(0.8);
        expect(result.message).toBe('Site made with a generic builder: Wix.com Website Builder');
    });

    it('should detect short meta description', () => {
        const html = '<html><head><meta name="description" content="This is a short description."></head></html>';
        const cheerio = load(html);
        const sniffer = new MetaSniffer();
        const result = sniffer.sniff(cheerio);
        expect(result.score).toBe(0.3);
        expect(result.message).toBe('Meta description is very short, possibly a default.');
    });

    it('should return 0 for very long or very short descriptions', () => {
        const longDescriptionHtml = '<html><head><meta name="description" content="This is a very long and detailed meta description that should not trigger the sniffer because it is well over fifty characters long."></head></html>';
        const shortDescriptionHtml = '<html><head><meta name="description" content="short"></head></html>';
        const sniffer = new MetaSniffer();

        expect(sniffer.sniff(load(longDescriptionHtml)).score).toBe(0);
        expect(sniffer.sniff(load(shortDescriptionHtml)).score).toBe(0);
    });

    it('should return 0 if no relevant meta tags are found', () => {
        const html = '<html><head><title>My Site</title></head></html>';
        const cheerio = load(html);
        const sniffer = new MetaSniffer();
        const result = sniffer.sniff(cheerio);
        expect(result.score).toBe(0);
        expect(result.message).toBe('No specific AI-related meta tags found.');
    });
});