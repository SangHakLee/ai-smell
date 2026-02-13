import { fetchHtml } from './fetcher';
import { parseHtml } from './parser';
import { allSniffers } from './sniffers';
import { calculateOverallScore } from './scorer';

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Please provide a URL as an argument.');
    process.exit(1);
  }

  console.log(`\n🐽 AI-Smell test for: ${url}\n`);

  try {
    const html = await fetchHtml(url);
    const $ = parseHtml(html);

    // Fetch external CSS files and inject them into the DOM
    const cssLinks = $('link[rel="stylesheet"]');
    for (let i = 0; i < cssLinks.length; i++) {
      const link = cssLinks.eq(i);
      let href = link.attr('href');

      if (href) {
        // Handle relative URLs
        if (href.startsWith('/')) {
          const urlObj = new URL(url);
          href = `${urlObj.protocol}//${urlObj.host}${href}`;
        } else if (!href.startsWith('http')) {
          href = new URL(href, url).toString();
        }

        try {
          const cssContent = await fetchHtml(href);
          // Inject CSS content as a style tag for analysis
          $('head').append(`<style data-external-css="${href}">${cssContent}</style>`);
        } catch (err) {
          // Ignore CSS fetch errors, continue with analysis
        }
      }
    }

    const results = allSniffers.map(sniffer => sniffer.sniff($, url));
    const { totalScore, report } = calculateOverallScore(results);

    console.log('## Analysis Report\n');

    // Calculate column widths for proper alignment
    const maxSnifferLength = Math.max(...report.map(r => r.sniffer.length), 'Sniffer'.length);
    const scoreColumnWidth = 17; // "██████████ 100% " length

    // Helper function to pad strings
    const pad = (str: string, length: number) => str + ' '.repeat(Math.max(0, length - str.length));

    // Print header
    console.log(`| ${pad('Sniffer', maxSnifferLength)} | ${pad('Score', scoreColumnWidth)} | Details`);
    console.log(`| ${'-'.repeat(maxSnifferLength)} | ${'-'.repeat(scoreColumnWidth)} | ${'-'.repeat(7)}`);

    // Print each result
    report.forEach(res => {
      const scoreBar = '█'.repeat(Math.round(res.score * 10)) + '░'.repeat(10 - Math.round(res.score * 10));
      const scoreText = `${scoreBar} ${(res.score * 100).toFixed(0).padStart(3)}%`;
      console.log(`| ${pad(`**${res.sniffer}**`, maxSnifferLength + 4)} | ${scoreText} | ${res.message}`);
    });
    console.log('');
    
    console.log(`\n📊 Overall AI-Smell Score: ${totalScore * 100}%`);
    if(totalScore > 0.7) {
        console.log("Verdict: Highly likely AI-generated or low-effort template.");
    } else if (totalScore > 0.4) {
        console.log("Verdict: Some elements suggest AI-generation or template usage.");
    } else {
        console.log("Verdict: Appears to be custom-built.");
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error(`An error occurred: ${error.message}`);
    } else {
      console.error('An unknown error occurred.');
    }
    process.exit(1);
  }
}

main();