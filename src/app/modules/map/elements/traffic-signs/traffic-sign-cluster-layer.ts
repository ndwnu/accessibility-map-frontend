import { LayerSpecification } from 'maplibre-gl';
import { MapLayer } from '../base/map-layer';

export class TrafficSignClusterLayer extends MapLayer {
  override get id(): string {
    return `${this.sourceId}-cluster-layer`;
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'circle',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#0363BD', 100, '#89b5b3'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 35],
      },
    };
  }
}
