import { Map, SourceSpecification } from 'maplibre-gl';
import { MapSource } from '@modules/map/elements/base/map-source';
import { environment } from '@env/environment';
import { DrivingDirectionLayer } from '@modules/map/elements/driving-direction/driving-direction-layer';

export class DrivingDirectionSource extends MapSource {
  constructor(map: Map) {
    super('driving-direction', map);

    this.layers = [new DrivingDirectionLayer(map, this.id)];
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return {
      type: 'vector',
      tiles: [environment.ndw.roadSectionsUrl],
    };
  }
}
