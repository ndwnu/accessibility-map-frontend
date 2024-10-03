import { environment } from '@env/environment';
import { Map, SourceSpecification } from 'maplibre-gl';
import { BrtLayer } from './brt-layer';
import { MapSource } from '@modules/map/elements/base/map-source';

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
