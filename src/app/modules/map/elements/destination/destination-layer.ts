import { LayerSpecification } from 'maplibre-gl';
import { MapLayer } from '../base/map-layer';

export class DestinationLayer extends MapLayer {
  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'symbol',
      layout: {
        'icon-image': 'marker',
        'icon-anchor': 'bottom',
        'icon-size': 0.2,
      },
    };
  }
}
