import { BerMapElementConfig, BerMapLayer } from '@modules/map/elements/base';
import { LayerSpecification } from 'maplibre-gl';

export class DestinationLayer extends BerMapLayer {
  constructor(config: BerMapElementConfig, sourceId: string) {
    super(config, sourceId);
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'symbol',
      filter: ['==', ['geometry-type'], 'Point'],
      layout: {
        'icon-image': ['case', ['==', ['get', 'accessible'], false], 'marker-negative', 'marker-positive'],
        'icon-anchor': 'bottom',
        'icon-size': 0.2,
        'text-field': ['case', ['==', ['get', 'accessible'], false], 'Onbereikbaar', 'Bereikbaar'],
        'text-offset': [0, 1],
      },
      paint: {
        'text-halo-color': '#fff',
        'text-halo-width': 2,
      },
    };
  }
}
