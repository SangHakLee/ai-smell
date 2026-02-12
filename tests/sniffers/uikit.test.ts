import { describe, it, expect } from 'vitest';
import { load } from 'cheerio';
import { UiKitSniffer } from '../../src/sniffers/uikit';

describe('UiKitSniffer', () => {
  it('should detect default bootstrap', () => {
    const html = '<html><head><link rel="stylesheet" href=".../bootstrap.min.css"></head></html>';
    const cheerio = load(html);
    const sniffer = new UiKitSniffer();
    const result = sniffer.sniff(cheerio);
    expect(result.score).toBe(0.7);
    expect(result.message).toContain('Bootstrap');
  });

  it('should detect bootstrap but give lower score with custom CSS', () => {
    const html = '<html><head><link rel="stylesheet" href=".../bootstrap.min.css"><link rel="stylesheet" href="custom.css"></head></html>';
    const cheerio = load(html);
    const sniffer = new UiKitSniffer();
    const result = sniffer.sniff(cheerio);
    expect(result.score).toBe(0.2);
  });

  it('should detect material UI', () => {
    const html = '<html><head><style id="Mui-Styles-123"></style></head></html>';
    const cheerio = load(html);
    const sniffer = new UiKitSniffer();
    const result = sniffer.sniff(cheerio);
    expect(result.score).toBe(0.6);
  });

  it('should return 0 if no common UI kit is found', () => {
    const html = '<html><head><link rel="stylesheet" href="my-styles.css"></head></html>';
    const cheerio = load(html);
    const sniffer = new UiKitSniffer();
    const result = sniffer.sniff(cheerio);
    expect(result.score).toBe(0);
  });
});
