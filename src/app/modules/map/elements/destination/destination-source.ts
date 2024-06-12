import { Map, SourceSpecification } from 'maplibre-gl';
import { map as rxMap } from 'rxjs';
import { MapSource } from '@modules/map/elements/base/map-source';
import { DestinationLayer } from '@modules/map/elements/destination/destination-layer';
import { DestinationDataService } from '@shared/services/destination-data.service';
import { pointToFeatureCollection } from '@shared/utils/geo-utils';

export class DestinationSource extends MapSource {
  constructor(map: Map, destinationDataService: DestinationDataService) {
    super('destination-point', map);

    this.featureCollection$ = destinationDataService.destinationPoint$.pipe(
      rxMap((destinationPoint) => pointToFeatureCollection(destinationPoint)),
    );

    this.layers = [new DestinationLayer(map, this.id)];
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
