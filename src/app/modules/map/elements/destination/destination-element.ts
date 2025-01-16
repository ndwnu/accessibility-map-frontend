import { Map } from 'maplibre-gl';
import { DestinationSource } from '@modules/map/elements/destination/destination-source';
import { MapElement } from '@modules/map/elements/base';
import { DestinationDataService } from '@shared/services/destination-data.service';
import { AccessibilityDataService } from '@shared/services';

export class DestinationElement extends MapElement {
  constructor(
    map: Map,
    accessibilityDataService: AccessibilityDataService,
    destinationDataService: DestinationDataService,
  ) {
    super(map);
    this.sources = [new DestinationSource(map, accessibilityDataService, destinationDataService)];
  }
}
