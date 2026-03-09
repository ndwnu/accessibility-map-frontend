import { FilterSpecification, LayerSpecification } from 'maplibre-gl';
import { MapLayer } from '@modules/map/elements/base/map-layer';
import { INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR, lineWidthFrcSpecification } from '@modules/map/elements/constants';
import { INACCESSIBLE_CARRIAGEWAY_TYPES } from '@modules/map/elements/accessibility/accessibility-layer';

export class MotorizedNoAccessLayer extends MapLayer {
  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      type: 'line',
      source: this.sourceId,
      'source-layer': 'roadSections',
      filter: this.getFilterSpecification(),
      paint: {
        'line-color': INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
        'line-width': lineWidthFrcSpecification,
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 16, 1],
      },
    };
  }

  override getFilterSpecification(): FilterSpecification {
    return ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]];
  }
}
