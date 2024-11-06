import { FilterSpecification, LayerSpecification, Map } from 'maplibre-gl';
import { clickEvent, MapLayer } from '../base/map-layer';

export class TrafficSignClusterLayer extends MapLayer {
  constructor(map: Map, sourceId: string) {
    super(map, sourceId);
  }

  override get id(): string {
    return `${this.sourceId}-cluster-layer`;
  }

  override getFilterSpecification(): FilterSpecification {
    return ['has', 'point_count'];
  }

  protected override onClick(event: clickEvent): void {
    this.map.easeTo({ center: event.lngLat, zoom: this.map.getZoom() + 1 });
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'circle',
      filter: this.getFilterSpecification(),
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#006FD3', 100, '#DD9900'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 35],
      },
    };
  }
}
