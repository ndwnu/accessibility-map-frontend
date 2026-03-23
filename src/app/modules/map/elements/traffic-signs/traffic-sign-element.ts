import { AccessibilityFilterService, TrafficSignService } from '@shared/services';
import { Map } from 'maplibre-gl';
import { MapElement } from '../base';
import { TrafficSignSource } from './traffic-sign-source';

export class TrafficSignElement extends MapElement {
  constructor(
    map: Map,
    trafficSignService: TrafficSignService,
    accessibilityFilterService: AccessibilityFilterService,
  ) {
    super(map);

    this.sources = [new TrafficSignSource(map, trafficSignService, accessibilityFilterService)];
  }
}
