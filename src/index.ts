#!/usr/bin/env node

import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { fetchHtml } from './fetcher';
import { parseHtml } from './parser';
import { allSniffers } from './sniffers';
import { calculateOverallScore } from './scorer';
import { SniffResult } from './types';

const helpMessage = `
AI-Smell Detector 🐽

Detects AI-generated websites by analyzing their tech stack, domain, code patterns, and more.

Usage:
  ai-smell <URL> [options]

Arguments:
  <URL>         The URL of the website to analyze.

Options:
  -f, --format <format>  Specify the output format for the console.
                         Formats: text (default), json, yaml
  -o, --output <file>    Save the report to a file. Format is inferred from
                         the file extension (.json, .yaml). Defaults to JSON.
  -h, --help             Display this help message.

Example:
  ai-smell https://example.com -o report.json
`;

function getVerdict(totalScore: number): string {
  if (totalScore > 0.7) {
    return "Highly likely AI-generated or low-effort template.";
  } else if (totalScore > 0.4) {
    return "Some elements suggest AI-generation or template usage.";
  } else {
    return "Appears to be custom-built.";
  }
}

function generateTextReport(totalScore: number, report: SniffResult[]): string {
  const reportLines: string[] = [];
  reportLines.push('## Analysis Report\n');

  // Calculate column widths for proper alignment
  const maxSnifferLength = Math.max(...report.map(r => r.sniffer.length), 'Sniffer'.length);
  const scoreColumnWidth = 17; // "██████████ 100% " length

  // Helper function to pad strings
  const pad = (str: string, length: number) => str + ' '.repeat(Math.max(0, length - str.length));

  // Print header
  reportLines.push(`| ${pad('Sniffer', maxSnifferLength)} | ${pad('Score', scoreColumnWidth)} | Details`);
  reportLines.push(`| ${'-'.repeat(maxSnifferLength)} | ${'-'.repeat(scoreColumnWidth)} | ${'-'.repeat(7)}`);

  // Print each result
  report.forEach(res => {
    const scoreBar = '█'.repeat(Math.round(res.score * 10)) + '░'.repeat(10 - Math.round(res.score * 10));
    const scoreText = `${scoreBar} ${(res.score * 100).toFixed(0).padStart(3)}%`;
    reportLines.push(`| ${pad(`**${res.sniffer}**`, maxSnifferLength + 4)} | ${scoreText} | ${res.message}`);
  });
  reportLines.push('');
  reportLines.push(`\n📊 Overall AI-Smell Score: ${totalScore * 100}%`);
  reportLines.push(`Verdict: ${getVerdict(totalScore)}`);
  return reportLines.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  let url: string | undefined;
  let outputFormat = 'text';
  let outputFilePath: string | undefined;

  // Basic argument parsing
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      console.log(helpMessage);
      process.exit(0);
    } else if (arg === '-f' || arg === '--format') {
      if (i + 1 < args.length) {
        outputFormat = args[i + 1].toLowerCase();
        i++; // Consume the value
      }
    } else if (arg === '-o' || arg === '--output') {
      if (i + 1 < args.length) {
        outputFilePath = args[i + 1];
        i++; // Consume the value
      }
    } else if (!arg.startsWith('-')) {
      if (!url) {
        url = arg;
      }
    }
  }

  if (!url) {
    console.log('Please provide a URL.\n');
    console.log(helpMessage);
    process.exit(1);
  }

  if (!outputFilePath) {
    console.log(`\n🐽 AI-Smell test for: ${url}\n`);
  }

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

    const outputData = {
      url,
      overallScore: totalScore,
      verdict: getVerdict(totalScore),
      report,
    };

    if (outputFilePath) {
      let fileOutputString: string;
      const fileExtension = outputFilePath.split('.').pop()?.toLowerCase();

      if (fileExtension === 'json') {
        fileOutputString = JSON.stringify(outputData, null, 2);
      } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
        fileOutputString = yaml.dump(outputData);
      } else { // Default to text for .txt or any other unknown extension
        const header = `🐽 AI-Smell test for: ${url}\n\n`;
        fileOutputString = header + generateTextReport(totalScore, report);
      }
      fs.writeFileSync(outputFilePath, fileOutputString);
      console.log(`\n✅ Report saved to ${outputFilePath}`);
    } else {
      let consoleOutput: string;
      switch (outputFormat) {
        case 'json':
          consoleOutput = JSON.stringify(outputData, null, 2);
          break;
        case 'yaml':
        case 'yml':
          consoleOutput = yaml.dump(outputData);
          break;
        default: // 'text'
          consoleOutput = generateTextReport(totalScore, report);
      }
      console.log(consoleOutput);
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