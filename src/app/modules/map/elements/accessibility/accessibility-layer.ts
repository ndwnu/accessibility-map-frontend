import { LayerSpecification, Map } from 'maplibre-gl';
import { MapLayer } from '../base/map-layer';
import {
  ACCESSIBLE_ROAD_SECTION_COLOR,
  INACCESSIBLE_ROAD_SECTION_COLOR,
  lineWidthFrcSpecification,
} from '@modules/map/elements/constants';

export const INACCESSIBLE_CARRIAGEWAY_TYPES = ['BU', 'BUS', 'CADO', 'FP', 'OVB', 'RP', 'VDF', 'VDV', 'VP', 'VV', 'VZ'];

export class AccessibilityLayer extends MapLayer {
  constructor(map: Map, sourceId: string) {
    super(map, sourceId);
  }

  protected override getSpecification(): Partial<LayerSpecification> {
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
