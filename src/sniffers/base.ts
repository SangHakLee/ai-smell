import { SniffResult, Sniffer } from '../types';
import { CheerioAPI } from 'cheerio';

export abstract class BaseSniffer implements Sniffer {
  constructor(protected name: string) {}

  abstract sniff(cheerio: CheerioAPI): SniffResult;

  protected createResult(score: number, message: string): SniffResult {
    return {
      sniffer: this.name,
      score,
      message,
    };
  }
}