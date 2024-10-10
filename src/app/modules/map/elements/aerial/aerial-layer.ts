import { MapLayer } from '@modules/map/elements/base/map-layer';
import { LayerSpecification } from 'maplibre-gl';

export class AerialLayer extends MapLayer {
  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      type: 'raster',
      source: this.sourceId,
      layout: {
        visibility: 'none',
      },
    };
  }
}
