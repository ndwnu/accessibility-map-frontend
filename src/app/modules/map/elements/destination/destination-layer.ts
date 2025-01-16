import { LayerSpecification, Map } from 'maplibre-gl';
import { AccessibilityDataService } from '@shared/services';

import { MapLayer } from '../base/map-layer';

export class DestinationLayer extends MapLayer {
  constructor(map: Map, sourceId: string, accessibilityDataService: AccessibilityDataService) {
    super(map, sourceId);

    accessibilityDataService.roadSectionInaccessible$.subscribe((inaccessible) => {
      const markerType = inaccessible ? 'negative' : 'positive';
      const textField = inaccessible ? 'Onbereikbaar' : 'Bereikbaar';

      map.setLayoutProperty(this.id, 'icon-image', `marker-${markerType}`);
      map.setLayoutProperty(this.id, 'text-field', textField);
    });
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      type: 'symbol',
      layout: {
        'icon-image': 'marker-positive',
        'icon-anchor': 'bottom',
        'icon-size': 0.2,
        'text-field': 'Bereikbaar',
        'text-offset': [0, 1],
      },
    };
  }
}
