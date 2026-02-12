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

    const results = allSniffers.map(sniffer => sniffer.sniff($));
    const { totalScore, report } = calculateOverallScore(results);

    console.log('--- Analysis Report ---');
    report.forEach(res => {
      console.log(`[${res.sniffer.padEnd(12)}]: Score ${res.score.toFixed(1)} | ${res.message}`);
    });
    console.log('-----------------------');
    
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