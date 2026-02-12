import { CheerioAPI } from 'cheerio';

export interface SniffResult {
  sniffer: string;
  score: number;
  message: string;
}

export interface Sniffer {
  sniff(cheerio: CheerioAPI): SniffResult;
}