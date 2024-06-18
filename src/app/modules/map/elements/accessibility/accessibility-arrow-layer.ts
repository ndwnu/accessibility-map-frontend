import { LayerSpecification } from 'maplibre-gl';
import { MapLayer } from '../base/map-layer';

const ONE_WAY_ARROW_SIZE = 0.5;
const ONE_WAY_ARROW_OPACITY = 0.4;
const ONE_WAY_ARROW_SPACING_MAX = 200;
const ONE_WAY_ARROW_SPACING_MIN = 70;
const ONE_WAY_DRIVING_DIRECTION = 'H';

export class AccessibilityArrowLayer extends MapLayer {
  get id(): string {
    return 'accessibility-arrow-layer';
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: 'roadSections',
      'source-layer': 'roadSections',
      type: 'symbol',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          ONE_WAY_ARROW_SPACING_MAX,
          18,
          ONE_WAY_ARROW_SPACING_MIN,
        ],
        'icon-image': 'arrow-icon',
        'icon-size': ONE_WAY_ARROW_SIZE,
      },
      paint: {
        'icon-opacity': ['interpolate', ['linear'], ['zoom'], 14.9, 0, 15, ONE_WAY_ARROW_OPACITY],
      },
      filter: ['==', ['get', 'drivingDirection'], ONE_WAY_DRIVING_DIRECTION],
    };
  }
}
