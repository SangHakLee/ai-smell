import { Sniffer } from '../types';
import { BoilerplateSniffer } from './boilerplate';
import { ContentSniffer } from './content';
import { DesignSniffer } from './design';
import { MetaSniffer } from './meta';
import { UiKitSniffer } from './uikit';

export const allSniffers: Sniffer[] = [
  new BoilerplateSniffer(),
  new UiKitSniffer(),
  new ContentSniffer(),
  new DesignSniffer(),
  new MetaSniffer(),
];
