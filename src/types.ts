import { CheerioAPI } from 'cheerio';

/**
 * The result of a single "sniffer" analysis.
 */
export interface SniffResult {
  /** The name of the sniffer that produced the result. */
  sniffer: string;
  /** A score from 0.0 (no smell) to 1.0 (strong smell). */
  score: number;
  /** A human-readable message explaining the score. */
  message: string;
}

/**
 * Defines the structure for a "sniffer" module.
 */
export interface Sniffer {
  /** The name of the sniffer. */
  name: string;
  /** The function that performs the analysis on the page's HTML. */
  sniff: ($: CheerioAPI, url?: string) => SniffResult;
}