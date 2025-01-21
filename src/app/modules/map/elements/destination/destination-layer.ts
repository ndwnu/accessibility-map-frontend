import { LayerSpecification, Map } from 'maplibre-gl';

import { MapLayer } from '../base/map-layer';

export class DestinationLayer extends MapLayer {
  constructor(map: Map, sourceId: string) {
    super(map, sourceId);
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'symbol',
      layout: {
        'icon-image': ['case', ['==', ['get', 'inaccessible'], true], 'marker-negative', 'marker-positive'],
        'icon-anchor': 'bottom',
        'icon-size': 0.2,
        'text-field': ['case', ['==', ['get', 'inaccessible'], true], 'Onbereikbaar', 'Bereikbaar'],
        'text-offset': [0, 1],
      },
      paint: {
        'text-halo-color': '#fff',
        'text-halo-width': 2,
      },
    };
  }
}
