# AI Smell Detector 🐽

Detect AI-generated websites by analyzing tech stacks, domains, color palettes, and code patterns. Identifies sites built with Lovable, v0.dev, Bolt, and other AI builders.

## Quick Start

### Install globally

```bash
npm install -g ai-smell
```

### Use it

```bash
ai-smell https://example.com
```

That's it! 🎉

## Example Output

```
🐽 AI-Smell test for: https://gcloud.lovable.app/

## Analysis Report

| Sniffer      | Score             | Details
| ------------ | ----------------- | -------
| **Domain**       | ██████████ 100% | 🎯 DEFINITIVE: Hosted on AI builder domain: lovable.app
| **TechStack**    | ████░░░░░░  40% | Vite + Tailwind (popular AI quick-start)
| **Meta**         | ██████████ 100% | AI builder detected in author tag: Lovable
| **Boilerplate**  | ██████████ 100% | Empty SPA skeleton; Vite default build structure
| **Comments**     | ██████████ 100% | TODO comments; Lovable AI builder badge detected
| **ColorPalette** | ░░░░░░░░░░   0% | Color palette does not match common AI patterns
| **Content**      | █████░░░░░  50% | Very little paragraph content on the page
| **Design**       | █████░░░░░  50% | Layout seems to be using older techniques
| **UIKit**        | ░░░░░░░░░░   0% | No common UI kits detected

📊 Overall AI-Smell Score: 66%
Verdict: Some elements suggest AI-generation or template usage.
```

## What It Detects

### 🎯 Domain Detection (Strongest Signal)
Detects 40+ AI service domains:
- **High-confidence AI builders:** Lovable, v0.dev, Bolt.new, GPT Engineer, Base44, Replit
- **Popular platforms:** Vercel, Netlify, GitHub Pages, Cloudflare Pages
- **No-code platforms:** Webflow, Wix, Squarespace, Bubble, Framer, Carrd

### 🔧 Tech Stack Analysis
Identifies common AI-generated combinations:
- **Next.js + Tailwind + Supabase** (The AI Starter Pack)
- **Vite + React + Tailwind**
- **shadcn/ui** components
- Framework over-engineering patterns

### 🎨 Color Palette Detection
Finds AI-favorite colors:
- **#0061FF** (Cursor/AI signature blue)
- **#0052D9** (AI-preferred blue)
- Vibrant oranges (#ff6b6b, #ff8c42)
- Purple gradients (#6c5ce7, #a29bfe)
- External CSS file analysis

### 📝 Code Pattern Analysis
- TODO comments in production
- AI placeholder text
- Empty SPA skeletons
- Vite default build structure
- Generic favicons

### 📊 Content & Design
- AI marketing phrases
- Minimal content patterns
- Generic layout templates
- Missing customization

## Features

- ✅ **Fast** - Analyzes websites in seconds
- ✅ **Accurate** - Weighted scoring system with 9 detection methods
- ✅ **Beautiful** - Markdown table output with visual progress bars
- ✅ **Extensible** - Easy to add new detection patterns
- ✅ **CLI & API** - Use as command-line tool or import as library

## Programmatic Usage

```bash
npm install ai-smell
```

```typescript
import { fetchHtml } from 'ai-smell/fetcher';
import { parseHtml } from 'ai-smell/parser';
import { allSniffers } from 'ai-smell/sniffers';
import { calculateOverallScore } from 'ai-smell/scorer';

const html = await fetchHtml('https://example.com');
const $ = parseHtml(html);
const results = allSniffers.map(sniffer => sniffer.sniff($, url));
const { totalScore, report } = calculateOverallScore(results);

console.log(`AI-Smell Score: ${totalScore * 100}%`);
```

## How It Works

AI Smell uses a weighted scoring system with 9 specialized "sniffers":

1. **Domain** (weight: 2.0) - AI service domain detection
2. **TechStack** (weight: 1.6) - Tech stack combination analysis
3. **Meta** (weight: 1.5) - Meta tag inspection
4. **Boilerplate** (weight: 1.5) - Framework boilerplate detection
5. **Comments** (weight: 1.4) - Code comment analysis
6. **Content** (weight: 1.2) - Text pattern detection
7. **ColorPalette** (weight: 1.1) - Color scheme analysis
8. **UIKit** (weight: 1.0) - UI framework detection
9. **Design** (weight: 0.8) - Layout pattern analysis

Each sniffer returns a score from 0.0 (no smell) to 1.0 (strong smell). Scores are weighted and averaged for the final result.

## Score Interpretation

- **70%+** - Highly likely AI-generated
- **40-70%** - Some AI patterns detected
- **Below 40%** - Appears custom-built

## Contributing

Want to add new AI service domains or detection patterns? See [CONTRIBUTING.md](CONTRIBUTING.md) for developer setup and guidelines.

## License

MIT

## Links

- [npm package](https://www.npmjs.com/package/ai-smell)
- [GitHub repository](https://github.com/yourusername/ai-smell)
- [Report issues](https://github.com/yourusername/ai-smell/issues)
