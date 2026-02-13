import { describe, it, expect } from 'vitest';
import { load } from 'cheerio';
import { BoilerplateSniffer } from '../../src/sniffers/boilerplate';

describe('BoilerplateSniffer', () => {
  it('should detect default React App title', () => {
    const html = '<html><head><title>React App</title></head><body></body></html>';
    const cheerio = load(html);
    const sniffer = new BoilerplateSniffer();
    const result = sniffer.sniff(cheerio);
    expect(result.score).toBe(0.9);
    expect(result.message).toBe('Default "React App" title found.');
  });

  it('should detect "This site was created with..." text', () => {
    const html = '<html><body><p>This site was created with XYZ builder.</p></body></html>';
    const cheerio = load(html);
    const sniffer = new BoilerplateSniffer();
    const result = sniffer.sniff(cheerio);
    expect(result.score).toBe(0.8);
    expect(result.message).toBe('Contains "This site was created with..." text.');
  });

  it('should return 0 if no boilerplate is found', () => {
    const html = '<html><head><title>My Custom Site</title></head><body><p>Hello world</p></body></html>';
    const cheerio = load(html);
    const sniffer = new BoilerplateSniffer();
    const result = sniffer.sniff(cheerio);
    expect(result.score).toBe(0);
    expect(result.message).toBe('No obvious framework boilerplate found.');
  });
});
