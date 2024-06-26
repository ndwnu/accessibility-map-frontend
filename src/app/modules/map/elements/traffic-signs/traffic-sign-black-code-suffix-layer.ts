import { LayerSpecification } from 'maplibre-gl';
import { MapLayer } from '../base/map-layer';

export class TrafficSignBlackCodeSuffixLayer extends MapLayer {
  override get id(): string {
    return `${this.sourceId}-black-code-suffix-layer`;
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'symbol',
      filter: ['all', ['!', ['has', 'point_count']], ['has', 'blackCode']],
      layout: {
        'text-field': ['case', ['any', ['==', ['get', 'rvvCode'], 'C20'], ['==', ['get', 'rvvCode'], 'C21']], 't', 'm'],
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': 6,
        'text-offset': [
          'case',
          ['any', ['==', ['get', 'rvvCode'], 'C17'], ['==', ['get', 'rvvCode'], 'C20']],
          [
            'case',
            ['==', ['length', ['get', 'blackCode']], 1],
            ['literal', [0.5, -0.3]],
            ['==', ['length', ['get', 'blackCode']], 2],
            ['literal', [0.8, -0.3]],
            ['literal', [1.1, -0.3]],
          ],
          [
            'case',
            ['==', ['length', ['get', 'blackCode']], 1],
            ['literal', [0.5, 0.1]],
            ['==', ['length', ['get', 'blackCode']], 2],
            ['literal', [0.8, 0.1]],
            ['literal', [1.1, 0.1]],
          ],
        ],
        'text-allow-overlap': true,
      },
    };
  }
}
