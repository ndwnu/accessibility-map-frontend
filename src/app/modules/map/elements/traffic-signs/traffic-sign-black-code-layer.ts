import { LayerSpecification } from 'maplibre-gl';
import { MapLayer } from '../base/map-layer';

export class TrafficSignBlackCodeLayer extends MapLayer {
  override get id(): string {
    return `${this.sourceId}-black-code-layer`;
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'symbol',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'text-field': ['get', 'blackCode'],
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': 9,
        'text-offset': [
          'case',
          ['any', ['==', ['get', 'rvvCode'], 'C17'], ['==', ['get', 'rvvCode'], 'C20']],
          ['literal', [-0.2, -0.3]],
          ['literal', [-0.2, 0]],
        ],
        'text-letter-spacing': -0.1,
      },
      paint: {
        'text-color': '#000000',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5,
      },
    };
  }
}
