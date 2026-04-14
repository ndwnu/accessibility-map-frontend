import { BerMapElementConfig, BerMapLayer } from '@modules/map/elements/base';
import { ClickEvent } from '@ndwnu/map';
import { TrafficSign } from '@shared/models/traffic-sign.model';
import { TrafficSignService } from '@shared/services';
import { FilterSpecification, LayerSpecification } from 'maplibre-gl';

const RVV_CODE_UNKNOWN = 'onbekend';

export class TrafficSignLayer extends BerMapLayer {
  constructor(
    config: BerMapElementConfig,
    sourceId: string,
    private readonly trafficSignService: TrafficSignService,
  ) {
    super(config, sourceId);
  }

  override getFilterSpecification(): FilterSpecification {
    return ['!', ['has', 'point_count']];
  }

  protected override onClick(event: ClickEvent): void {
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
