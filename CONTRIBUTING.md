# Contributing to AI Smell

Thank you for your interest in contributing to AI Smell! This document provides guidelines for developers who want to contribute to the project.

## Development Setup

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn

### Getting Started

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/yourusername/ai-smell.git
   cd ai-smell
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Run locally**

   ```bash
   npm start -- <URL>
   # or for development with hot reload
   npm run dev -- <URL>
   ```

5. **Link globally for testing**

   ```bash
   npm link
   ai-smell <URL>
   ```

## Project Structure

```
ai-smell/
├── src/
│   ├── sniffers/          # Detection modules
│   │   ├── domain.ts      # AI service domain detection
│   │   ├── techstack.ts   # Tech stack analysis
│   │   ├── meta.ts        # Meta tag analysis
│   │   ├── boilerplate.ts # Framework boilerplate detection
│   │   ├── comments.ts    # TODO/placeholder detection
│   │   ├── color.ts       # Color palette analysis
│   │   ├── content.ts     # Content analysis
│   │   ├── design.ts      # Design pattern detection
│   │   ├── uikit.ts       # UI kit detection
│   │   └── index.ts       # Sniffer registry
│   ├── fetcher.ts         # HTML fetching
│   ├── parser.ts          # HTML parsing
│   ├── scorer.ts          # Scoring and weighting
│   ├── types.ts           # TypeScript types
│   └── index.ts           # CLI entry point
├── dist/                  # Compiled JavaScript
└── tests/                 # Test files
```

## Adding a New Sniffer

1. **Create a new sniffer file** in `src/sniffers/`

   ```typescript
   import { CheerioAPI } from 'cheerio';
   import { BaseSniffer } from './base';
   import { SniffResult } from '../types';

   export class YourSniffer extends BaseSniffer {
     constructor() {
       super('YourSnifferName');
     }

     sniff(cheerio: CheerioAPI, url?: string): SniffResult {
       let score = 0;
       const messages: string[] = [];

       // Your detection logic here
       // score should be between 0.0 and 1.0

       if (messages.length === 0) {
         return this.createResult(0, 'No issues detected');
       }

       return this.createResult(
         parseFloat(score.toFixed(2)),
         messages.join('; ')
       );
     }
   }
   ```

2. **Register the sniffer** in `src/sniffers/index.ts`

   ```typescript
   import { YourSniffer } from './yoursniffer';

   export const allSniffers: Sniffer[] = [
     // ... other sniffers
     new YourSniffer(),
   ];
   ```

3. **Add weight** in `src/scorer.ts`

   ```typescript
   const snifferWeights: { [key: string]: number } = {
     // ... other weights
     YourSnifferName: 1.2, // Adjust weight as needed
   };
   ```

## Adding AI Service Domains

Edit the arrays in `src/sniffers/domain.ts`:

```typescript
export const AI_SERVICE_DOMAINS = [
  // Add your domain here
  'newaiservice.app',
  // ...
];

export const HIGH_CONFIDENCE_AI_DOMAINS = [
  // Add if it's definitely an AI builder
  'newaiservice.app',
  // ...
];
```

## Adding Tech Stack Patterns

Edit `src/sniffers/techstack.ts`:

```typescript
export const AI_TECH_STACKS = {
  // Add new tech detection patterns
  yourtech: ['pattern1', 'pattern2', /regex-pattern/],
  // ...
};
```

## Testing

```bash
# Run tests
npm test

# Test specific URL
npm run dev -- https://example.com

# Test with local link
npm link
ai-smell https://example.com
```

## Code Style

- Use TypeScript
- Follow existing code patterns
- Add comments for complex logic
- Keep sniffers focused on single responsibility

## Publishing Workflow

1. **Update version**

   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```

2. **Build and test**

   ```bash
   npm run build
   npm link
   ai-smell https://test-site.com
   ```

3. **Login to npm** (first time only)

   ```bash
   npm login
   ```

4. **Publish**

   ```bash
   npm publish
   ```

5. **Verify publication**

   ```bash
   npm install -g ai-smell
   ai-smell https://test-site.com
   ```

## Sniffer Scoring Guidelines

- **0.0 - 0.3**: Weak signal (might be coincidence)
- **0.4 - 0.6**: Medium signal (suspicious pattern)
- **0.7 - 0.9**: Strong signal (likely AI-generated)
- **1.0**: Definitive proof (e.g., AI service domain)

## Sniffer Weight Guidelines

- **2.0+**: Definitive signals (domains, explicit markers)
- **1.5 - 1.9**: Strong signals (meta tags, boilerplate)
- **1.0 - 1.4**: Medium signals (tech stacks, comments)
- **0.5 - 0.9**: Weak signals (design patterns, colors)

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-sniffer`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request with description of changes

## Questions?

Open an issue on GitHub or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
