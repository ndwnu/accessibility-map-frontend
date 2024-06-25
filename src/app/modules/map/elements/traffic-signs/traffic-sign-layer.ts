import { TrafficSign } from '@shared/models/traffic-sign.model';
import { TrafficSignService } from '@shared/services';
import { LayerSpecification, Map } from 'maplibre-gl';
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
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': [
          'coalesce',
          [
            'case',
            ['all', ['has', 'rvv_code'], ['has', 'black_code'], ['has', 'zone_code']],
            ['image', ['concat', ['get', 'rvv_code'], '-', ['get', 'black_code'], '-', ['get', 'zone_code']]],
            ['image', ''],
          ],
          [
            'case',
            ['all', ['has', 'rvv_code'], ['has', 'zone_code']],
            ['image', ['concat', ['get', 'rvv_code'], '-', ['get', 'zone_code']]],
            ['image', ''],
          ],
          [
            'case',
            ['all', ['has', 'rvv_code'], ['has', 'black_code']],
            ['image', ['concat', ['get', 'rvv_code'], '-', ['get', 'black_code']]],
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
