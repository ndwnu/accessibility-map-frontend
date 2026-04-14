import { AccessibilityFilterService, TrafficSignService } from '@shared/services';
import { BerMapElement, BerMapElementConfig } from '../base';
import { TrafficSignSource } from './traffic-sign-source';

export class TrafficSignElement extends BerMapElement {
  constructor(
    config: BerMapElementConfig,
    trafficSignService: TrafficSignService,
    accessibilityFilterService: AccessibilityFilterService,
  ) {
    super(config);

    this.sources = [new TrafficSignSource(config, trafficSignService, accessibilityFilterService)];
    this.isVisible = true;
  }
}
