import { environment } from '@env/environment';
import { MapSource } from '@modules/map/elements/base/map-source';
import { BrtLayer } from '@modules/map/elements/brt/brt-layer';

import { Map, SourceSpecification } from 'maplibre-gl';

export class BrtSource extends MapSource {
  constructor(map: Map) {
    super('brt', map);

    this.layers = [new BrtLayer(map, this.id)];
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return {
      type: 'raster',
      tiles: [environment.pdok.brtTilesUrl],
      tileSize: 256,
    };
  }
}
