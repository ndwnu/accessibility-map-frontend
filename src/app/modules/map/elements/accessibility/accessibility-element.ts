import { AccessibilityDataService } from '@shared/services';
import { Map } from 'maplibre-gl';
import { MapElement } from '../base';
import { AccessibilitySource } from './accessibility-source';

export class AccessibilityElement extends MapElement {
  constructor(map: Map, accessibilityDataService: AccessibilityDataService) {
    super(map);

    this.sources = [new AccessibilitySource(map, accessibilityDataService)];
  }
}
