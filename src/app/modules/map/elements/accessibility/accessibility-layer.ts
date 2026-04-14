import { LayerSpecification } from 'maplibre-gl';
import { ACCESSIBLE_ROAD_SECTION_COLOR, INACCESSIBLE_ROAD_SECTION_COLOR } from '@modules/map/elements/constants';
import { BerMapElementConfig, BerMapLayer } from '@modules/map/elements/base';
import { lineWidthFrcSpecification } from '@ndwnu/map';

export const INACCESSIBLE_CARRIAGEWAY_TYPES = ['BU', 'BUS', 'CADO', 'FP', 'OVB', 'RP', 'VDF', 'VDV', 'VP', 'VV', 'VZ'];

export class AccessibilityLayer extends BerMapLayer {
  constructor(config: BerMapElementConfig, sourceId: string) {
    super(config, sourceId);
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      type: 'line',
      source: this.sourceId,

      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        'line-sort-key': ['-', 8, ['to-number', ['get', 'functionalRoadClass']]],
      },
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'accessible'], false],
          INACCESSIBLE_ROAD_SECTION_COLOR,
          ACCESSIBLE_ROAD_SECTION_COLOR,
        ],
        'line-width': lineWidthFrcSpecification,
        'line-opacity': 1,
      },
    };
  }
}
