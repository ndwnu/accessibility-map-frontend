import { SourceSpecification } from 'maplibre-gl';
import { BerMapSource } from '@modules/map/elements/base/map-source';
import { environment } from '@env/environment';
import { DrivingDirectionLayer } from '@modules/map/elements/driving-direction/driving-direction-layer';
import { BerMapElementConfig } from '@modules/map/elements/base';

export class DrivingDirectionSource extends BerMapSource {
  constructor(config: BerMapElementConfig) {
    super('driving-direction', config);

    this.layers = [new DrivingDirectionLayer(config, this.id)];
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return {
      type: 'vector',
      tiles: [environment.ndw.roadSectionsUrl],
    };
  }
}
