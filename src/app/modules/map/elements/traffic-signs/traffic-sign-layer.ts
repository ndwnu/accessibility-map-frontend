import { TrafficSign } from '@shared/models/traffic-sign.model';
import { TrafficSignService } from '@shared/services';
import { FilterSpecification, LayerSpecification, Map } from 'maplibre-gl';
import { clickEvent, MapLayer } from '../base/map-layer';

const RVV_CODE_UNKNOWN = 'onbekend';

export class TrafficSignLayer extends MapLayer {
  constructor(
    map: Map,
    sourceId: string,
    private readonly trafficSignService: TrafficSignService,
  ) {
    super(map, sourceId);
  }

  override getFilterSpecification(): FilterSpecification {
    return ['!', ['has', 'point_count']];
  }

  protected override onClick(event: clickEvent): void {
    const trafficSigns = event.features?.map(
      (feature) =>
        ({
          ...feature.properties,
          textSigns: JSON.parse(feature.properties.textSigns || '{}'),
          lnglat: event.lngLat,
        }) as TrafficSign,
    );

    this.trafficSignService.setSelectedTrafficSigns(trafficSigns);
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'symbol',
      filter: this.getFilterSpecification(),
      layout: {
        'icon-image': [
          'coalesce',
          [
            'case',
            ['all', ['has', 'rvvCode'], ['has', 'zoneCode']],
            ['image', ['concat', ['get', 'rvvCode'], '-', ['get', 'zoneCode']]],
            ['image', ''],
          ],
          ['get', 'rvvCode'],
          ['image', RVV_CODE_UNKNOWN],
        ],
        'icon-allow-overlap': true,
        'icon-rotation-alignment': 'map',
        'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.75, 15, 1.3],
      },
    };
  }
}
