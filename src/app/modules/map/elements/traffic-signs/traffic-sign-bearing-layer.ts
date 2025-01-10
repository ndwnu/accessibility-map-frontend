import { FilterSpecification, LayerSpecification, Map } from 'maplibre-gl';
import { MapLayer } from '../base/map-layer';

export class TrafficSignBearingLayer extends MapLayer {
  constructor(map: Map, sourceId: string) {
    super(map, sourceId);
  }
  override get id(): string {
    return `${this.sourceId}-bearing-layer`;
  }
  override getFilterSpecification(): FilterSpecification {
    return ['!', ['has', 'point_count']];
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'symbol',
      filter: this.getFilterSpecification(),
      layout: {
        'icon-image': 'black-arrow-icon',
        'icon-allow-overlap': true,
        'icon-rotation-alignment': 'map',
        'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.7, 15, 0.7],
        'icon-rotate': ['-', ['get', 'bearing'], 90],
        'icon-offset': [30, 0],
      },
    };
  }
}
