import { environment } from '@env/environment';
import { AerialLayer } from '@modules/map/elements/aerial/aerial-layer';
import { MapSource } from '@modules/map/elements/base/map-source';

import { Map, SourceSpecification } from 'maplibre-gl';

export class AerialSource extends MapSource {
  constructor(map: Map) {
    super('aerial', map);

    this.layers = [new AerialLayer(map, this.id)];
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return {
      type: 'raster',
      tiles: [environment.pdok.aerialTilesUrl],
      tileSize: 256,
    };
  }
}
