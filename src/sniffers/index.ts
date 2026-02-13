import { Sniffer } from '../types';
import { BoilerplateSniffer } from './boilerplate';
import { ColorPaletteSniffer } from './color';
import { CommentsSniffer } from './comments';
import { ContentSniffer } from './content';
import { DesignSniffer } from './design';
import { DomainSniffer } from './domain';
import { MetaSniffer } from './meta';
import { TechStackSniffer } from './techstack';
import { UiKitSniffer } from './uikit';

export const allSniffers: Sniffer[] = [
  new DomainSniffer(),      // Check this FIRST - most definitive signal
  new TechStackSniffer(),   // AI tech stack combinations
  new MetaSniffer(),
  new BoilerplateSniffer(),
  new CommentsSniffer(),
  new ColorPaletteSniffer(),
  new ContentSniffer(),
  new DesignSniffer(),
  new UiKitSniffer(),
];
