import { FilterSpecification, LayerSpecification } from 'maplibre-gl';
import { MapLayer } from '../base/map-layer';

export class TrafficSignClusterLayer extends MapLayer {
  override get id(): string {
    return `${this.sourceId}-cluster-layer`;
  }

  override getFilterSpecification(): FilterSpecification {
    return ['has', 'point_count'];
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'circle',
      filter: this.getFilterSpecification(),
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#0363BD', 100, '#89b5b3'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 35],
      },
    };
  }
}
