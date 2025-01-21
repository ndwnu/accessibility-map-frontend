import { Map, SourceSpecification } from 'maplibre-gl';
import { combineLatest, map as rxMap } from 'rxjs';
import { MapSource } from '@modules/map/elements/base/map-source';
import { DestinationLayer } from '@modules/map/elements/destination/destination-layer';
import { DestinationDataService } from '@shared/services/destination-data.service';
import { AccessibilityDataService } from '@shared/services';
import { featureCollection, point } from '@turf/helpers';

export class DestinationSource extends MapSource {
  constructor(
    map: Map,
    accessibilityDataService: AccessibilityDataService,
    destinationDataService: DestinationDataService,
  ) {
    super('destination-point', map);

    this.layers = [new DestinationLayer(map, this.id)];

    this.featureCollection$ = combineLatest([
      destinationDataService.destinationPoint$,
      accessibilityDataService.roadSectionInaccessible$,
    ]).pipe(
      rxMap(([destinationPoint, inaccessible]) => {
        if (!destinationPoint) {
          return featureCollection([]);
        }
        const pointFeature = point(destinationPoint, { inaccessible });
        return featureCollection([pointFeature]);
      }),
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
