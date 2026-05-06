import { SourceSpecification } from 'maplibre-gl';
import { BerMapSource } from '@modules/map/elements/base/map-source';
import { DestinationLayer } from '@modules/map/elements/destination/destination-layer';
import { AccessibilityDataService, MapPopupService } from '@shared/services';
import { EMPTY_SOURCE_SPECIFICATION } from '@modules/map/elements/constants';
import { BerMapElementConfig } from '@modules/map/elements/base';

export class DestinationSource extends BerMapSource {
  constructor(
    config: BerMapElementConfig,
    accessibilityDataService: AccessibilityDataService,
    mapPopupService: MapPopupService,
  ) {
    super('destination-point', config);

    this.layers = [new DestinationLayer(config, this.id, mapPopupService)];

    // In the accessibility response a point is included whenever a destination is set.
    // At this moment all other features are linestrings, so we can use this source to display the destination point on the map.
    this.featureCollection$ = accessibilityDataService.roadAccessibility$;
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return EMPTY_SOURCE_SPECIFICATION;
  }
}
