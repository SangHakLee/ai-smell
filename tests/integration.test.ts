import { describe, it, expect } from 'vitest';
import { parseHtml } from '../src/parser';
import { allSniffers } from '../src/sniffers';
import { calculateOverallScore } from '../src/scorer';

describe('Integration Test', () => {
  it('should analyze a sample AI-generated page and return a high score', () => {
    const sampleHtml = `
      <html>
        <head>
          <title>React App</title>
          <meta name="generator" content="AI Website Builder 2.0">
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        </head>
        <body>
          <h1>Welcome</h1>
          <p>In today's digital age, harnessing the power of technology is key. We are revolutionizing the industry.</p>
        </body>
      </html>
    `;

    const $ = parseHtml(sampleHtml);
    const results = allSniffers.map(sniffer => sniffer.sniff($));
    const { totalScore } = calculateOverallScore(results);

    // Check individual sniffers
    const metaResult = results.find(r => r.sniffer === 'Meta');
    const boilerplateResult = results.find(r => r.sniffer === 'Boilerplate');
    const uikitResult = results.find(r => r.sniffer === 'UIKit');
    const contentResult = results.find(r => r.sniffer === 'Content');

    expect(metaResult?.score).toBe(1.0);
    expect(boilerplateResult?.score).toBe(0.9);
    expect(uikitResult?.score).toBe(0.7);
    expect(contentResult?.score).toBeGreaterThan(0);

    // Check overall score
    expect(totalScore).toBeGreaterThan(0.6);
  });
});
