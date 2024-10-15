import { FilterSpecification, LayerSpecification } from 'maplibre-gl';
import { MapLayer } from '../base/map-layer';

export class TrafficSignClusterLabelLayer extends MapLayer {
  override get id(): string {
    return `${this.sourceId}-cluster-label-layer`;
  }

  override getFilterSpecification(): FilterSpecification {
    return ['has', 'point_count'];
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'symbol',
      filter: this.getFilterSpecification(),
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
      paint: {
        'text-color': ['case', ['<=', ['get', 'point_count'], 100], '#ffffff', '#000000'],
      },
    };
  }
}
