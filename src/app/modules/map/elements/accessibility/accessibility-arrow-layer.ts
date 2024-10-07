import { LayerSpecification } from 'maplibre-gl';
import { MapLayer } from '../base/map-layer';
import { INACCESSIBLE_CARRIAGEWAY_TYPES } from '@modules/map/elements/accessibility/accessibility-layer';

const ONE_WAY_ARROW_SIZE_MIN = 0.4;
const ONE_WAY_ARROW_SIZE_MAX = 0.5;
const ONE_WAY_ARROW_OPACITY_MIN = 0.6;
const ONE_WAY_ARROW_OPACITY_MAX = 1;
const ONE_WAY_DRIVING_DIRECTION = 'H';

export class AccessibilityArrowLayer extends MapLayer {
  override get id(): string {
    return `${this.sourceId}-arrow-layer`;
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: this.sourceId,
      'source-layer': 'roadSections',
      type: 'symbol',
      layout: {
        'symbol-placement': 'line-center',
        'icon-image': 'arrow-icon',
        'icon-size': {
          type: 'interval',
          stops: [
            [15, ONE_WAY_ARROW_SIZE_MAX],
            [18, ONE_WAY_ARROW_SIZE_MIN],
          ],
        },
      },
      paint: {
        'icon-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          14.9,
          0,
          15,
          ONE_WAY_ARROW_OPACITY_MIN,
          18,
          ONE_WAY_ARROW_OPACITY_MAX,
        ],
      },
      filter: [
        'all',
        ['==', ['get', 'drivingDirection'], ONE_WAY_DRIVING_DIRECTION],
        ['!', ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]]],
      ],
    };
  }
}
