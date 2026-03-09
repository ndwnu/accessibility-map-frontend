import { Map } from 'maplibre-gl';
import { MapElement } from '../base';
import { AccessibilitySource } from '@modules/map/elements/accessibility/accessibility-source';
import { AccessibilityDataService } from '@shared/services';

export class AccessibilityElement extends MapElement {
  constructor(map: Map, accessibilityDataService: AccessibilityDataService) {
    super(map);

    this.sources = [new AccessibilitySource(map, accessibilityDataService)];
  }
}
