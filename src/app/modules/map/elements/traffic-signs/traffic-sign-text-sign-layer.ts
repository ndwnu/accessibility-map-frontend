import { LayerSpecification } from 'maplibre-gl';
import { MapLayer } from '../base/map-layer';

export class TrafficSignTextSignLayer extends MapLayer {
  override get id(): string {
    return `${this.sourceId}-text-sign-layer`;
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'symbol',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-allow-overlap': true,
        'icon-rotation-alignment': 'map',
        'icon-image': [
          'case',
          ['all', ['>', ['length', ['get', 'textSigns']], 0], ['to-boolean', ['get', 'rvvCode']]],
          'text-sign',
          '',
        ],
        'icon-offset': [0, 14],
        'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.75, 15, 1.3],
      },
    };
  }
}
