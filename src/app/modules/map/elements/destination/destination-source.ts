import { Map, SourceSpecification } from 'maplibre-gl';
import { combineLatest, map as rxMap, switchMap, timer } from 'rxjs';
import { MapSource } from '@modules/map/elements/base/map-source';
import { DestinationLayer } from '@modules/map/elements/destination/destination-layer';
import { DestinationDataService } from '@shared/services/destination-data.service';
import { pointToFeatureCollection } from '@shared/utils/geo-utils';
import { AccessibilityDataService } from '@shared/services';

export class DestinationSource extends MapSource {
  constructor(
    map: Map,
    accessibilityDataService: AccessibilityDataService,
    destinationDataService: DestinationDataService,
  ) {
    super('destination-point', map);

    this.layers = [new DestinationLayer(map, this.id, accessibilityDataService)];

    this.featureCollection$ = destinationDataService.destinationPoint$.pipe(
      rxMap((destinationPoint) => pointToFeatureCollection(destinationPoint)),
    );
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    };
  }
}
