import { Map, SourceSpecification } from 'maplibre-gl';
import { MapSource } from '@modules/map/elements/base/map-source';
import { DestinationLayer } from '@modules/map/elements/destination/destination-layer';
import { AccessibilityDataService } from '@shared/services';
import { EMPTY_SOURCE_SPECIFICATION } from '@modules/map/elements/constants';

export class DestinationSource extends MapSource {
  constructor(map: Map, accessibilityDataService: AccessibilityDataService) {
    super('destination-point', map);

    this.layers = [new DestinationLayer(map, this.id)];

    // In the accessibility response a point is included whenever a destination is set.
    // At this moment all other features are linestrings, so we can use this source to display the destination point on the map.
    this.featureCollection$ = accessibilityDataService.roadAccessibility$;
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return EMPTY_SOURCE_SPECIFICATION;
  }
}
