import { AccessibilityDataService, TrafficSignService } from '@shared/services';
import { Map } from 'maplibre-gl';
import { MapElement } from '../base';
import { TrafficSignSource } from './traffic-sign-source';

export class TrafficSignElement extends MapElement {
  constructor(map: Map, trafficSignService: TrafficSignService, accessibilityDataService: AccessibilityDataService) {
    super(map);

    this.sources = [new TrafficSignSource(map, trafficSignService, accessibilityDataService)];
  }
}
