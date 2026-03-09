import { Map } from 'maplibre-gl';
import { DestinationSource } from '@modules/map/elements/destination/destination-source';
import { MapElement } from '@modules/map/elements/base';
import { AccessibilityDataService } from '@shared/services';

export class DestinationElement extends MapElement {
  constructor(map: Map, accessibilityDataService: AccessibilityDataService) {
    super(map);
    this.sources = [new DestinationSource(map, accessibilityDataService)];
  }
}
