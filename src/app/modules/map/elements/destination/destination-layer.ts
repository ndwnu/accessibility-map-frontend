import { BerMapElementConfig, BerMapLayer } from '@modules/map/elements/base';
import { ClickEvent } from '@ndwnu/map';
import { LayerSpecification } from 'maplibre-gl';
import { MapPopupService } from '@shared/services';

export class DestinationLayer extends BerMapLayer {
  constructor(
    config: BerMapElementConfig,
    sourceId: string,
    private readonly mapPopupService: MapPopupService,
  ) {
    super(config, sourceId);
  }

  protected override onClick(event: ClickEvent): void {
    const feature = event.features?.[0];
    if (!feature) {
      return;
    }

    if (feature.properties?.['accessible'] === false) {
      this.mapPopupService.openDestinationPopup(event.lngLat);
    } else {
      this.mapPopupService.closePopup();
    }
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'symbol',
      filter: ['==', ['geometry-type'], 'Point'],
      layout: {
        'icon-image': ['case', ['==', ['get', 'accessible'], false], 'marker-negative', 'marker-positive'],
        'icon-anchor': 'bottom',
        'icon-size': 0.2,
        'text-field': ['case', ['==', ['get', 'accessible'], false], 'Onbereikbaar', 'Bereikbaar'],
        'text-offset': [0, 1],
      },
      paint: {
        'text-halo-color': '#fff',
        'text-halo-width': 2,
      },
    };
  }
}
