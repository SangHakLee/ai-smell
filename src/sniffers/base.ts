import { CheerioAPI } from 'cheerio';
import { SniffResult, Sniffer } from '../types';

/**
 * An abstract base class for creating new Sniffer modules.
 * It provides a common structure and helper methods.
 */
export abstract class BaseSniffer implements Sniffer {
  /**
   * The name of the sniffer. It's public to satisfy the Sniffer interface.
   */
  public readonly name: string;

  /**
   * @param name The name of the sniffer.
   */
  protected constructor(name: string) {
    this.name = name;
  }

  /**
   * The abstract sniff method that must be implemented by subclasses.
   * @param cheerio The CheerioAPI instance for the page.
   * @param url Optional URL of the page being analyzed.
   */
  abstract sniff(cheerio: CheerioAPI, url?: string): SniffResult;

  /**
   * A helper method to create a SniffResult object.
   * @param score The score for the sniff.
   * @param message The message for the sniff.
   * @returns A SniffResult object.
   */
  protected createResult(score: number, message: string): SniffResult {
    return {
      sniffer: this.name,
      score,
      message,
    };
  }
}