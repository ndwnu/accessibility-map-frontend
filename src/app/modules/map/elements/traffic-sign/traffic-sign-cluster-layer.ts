import { BerMapElementConfig, BerMapLayer } from '@modules/map/elements/base';
import { ClickEvent } from '@ndwnu/map';
import { FilterSpecification, LayerSpecification } from 'maplibre-gl';

export class TrafficSignClusterLayer extends BerMapLayer {
  constructor(config: BerMapElementConfig, sourceId: string) {
    super(config, sourceId);
  }

  override get id(): string {
    return `${this.sourceId}-cluster-layer`;
  }

  override getFilterSpecification(): FilterSpecification {
    return ['has', 'point_count'];
  }

  protected override onClick(event: ClickEvent): void {
    this.config.map.easeTo({ center: event.lngLat, zoom: this.config.map.getZoom() + 1 });
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'circle',
      filter: this.getFilterSpecification(),
      paint: {
        'circle-color': '#006FD3',
        'circle-radius': 12,
      },
    };
  }
}
