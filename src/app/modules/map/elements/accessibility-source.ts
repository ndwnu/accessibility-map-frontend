import { environment } from '@env/environment';
import {
  MIN_ZOOM,
  INACCESSIBLE_CARRIAGEWAY_TYPES,
  ONE_WAY_ARROW_SPACING_MAX,
  ONE_WAY_ARROW_SPACING_MIN,
  ONE_WAY_ARROW_SIZE,
  ONE_WAY_ARROW_OPACITY,
  ONE_WAY_DRIVING_DIRECTION,
  LINE_OPACITY,
  INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
  INACTIVE_MUNICIPALITY_COLOR,
  INACCESSIBLE_ROAD_SECTION_COLOR,
  ACCESSIBLE_ROAD_SECTION_COLOR,
} from '@modules/map/elements/constants';
import { clickEvent, MapLayer, MapSource } from '@modules/map/elements/models';
import { InaccessibleRoadSection } from '@shared/models';

import { Map, SourceSpecification } from 'maplibre-gl';

const ACCESSIBILITY_LAYER_ID = 'accessibility';

export class AccessibilitySource implements MapSource {
  elementId: string;
  id: string;
  layers: MapLayer[];
  specification: SourceSpecification;
  sourceId = 'roadSections';
  sourceLayer = 'roadSections';

  constructor(elementId: string) {
    this.elementId = elementId;
    this.id = 'osm-vector';
    this.layers = [
      {
        id: 'color',
        specification: {
          id: ACCESSIBILITY_LAYER_ID,
          source: this.sourceId,
          'source-layer': this.sourceLayer,
          type: 'line',
          minzoom: MIN_ZOOM,
          layout: {
            'line-cap': 'butt',
            'line-join': 'bevel',
          },
          paint: {
            'line-gap-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12,
              ['case', ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]], 2, 0],
              15,
              ['case', ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]], 4, 0],
            ],
            'line-opacity': 0,
          },
        },
        show: true,
      },
      {
        id: 'arrow',
        specification: {
          id: 'oneway-arrow',
          source: this.sourceId,
          'source-layer': this.sourceLayer,
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
        },
        show: true,
      },
    ];
    this.specification = {
      type: 'vector',
      tiles: [environment.mapStyles['default']],
    };
  }

  updateLayerStyles(map: Map, inaccessibleRoadSections: InaccessibleRoadSection[], municipality: string) {
    const inaccessibleRoadSectionIds = inaccessibleRoadSections
      .filter((section) => section.backwardAccessible === false && section.forwardAccessible === false)
      .map((section) => section.roadSectionId);
    const municipalityId = Number(municipality.replace(/^GM/, '').replace(/^0+/, ''));

    if (map.getLayer(ACCESSIBILITY_LAYER_ID)) {
      map.setPaintProperty(ACCESSIBILITY_LAYER_ID, 'line-opacity', [
        'case',
        ['!=', ['get', 'municipalityId'], municipalityId],
        0,
        LINE_OPACITY,
      ]);
      map.setPaintProperty(ACCESSIBILITY_LAYER_ID, 'line-color', [
        'case',
        ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]],
        INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
        ['!=', ['get', 'municipalityId'], municipalityId],
        INACTIVE_MUNICIPALITY_COLOR,
        ['in', ['get', 'roadSectionId'], ['literal', inaccessibleRoadSectionIds]],
        INACCESSIBLE_ROAD_SECTION_COLOR,
        ACCESSIBLE_ROAD_SECTION_COLOR,
      ]);
      map.setPaintProperty(ACCESSIBILITY_LAYER_ID, 'line-width', [
        'interpolate',
        ['linear'],
        ['zoom'],
        12,
        [
          'case',
          ['in', ['get', 'roadSectionId'], ['literal', inaccessibleRoadSectionIds]],
          4,
          ['case', ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]], 1, 1],
        ],
        16,
        [
          'case',
          ['in', ['get', 'roadSectionId'], ['literal', inaccessibleRoadSectionIds]],
          6,
          ['case', ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]], 1, 6],
        ],
      ]);
    }
  }

  onClick(event: clickEvent): void {
    console.log('Accessibility road clicked', event.features);
  }
}
