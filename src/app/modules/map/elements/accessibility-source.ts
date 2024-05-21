import { environment } from '@env/environment';
import { clickEvent, MapLayer, MapSource } from '@modules/map/elements/models';
import { InaccessibleRoadSection } from '@shared/models';

import { Map, SourceSpecification } from 'maplibre-gl';

const MIN_ZOOM = 7;
const INACCESSIBLE_CARRIAGEWAY_TYPES = ['BU', 'BUS', 'FP', 'VP', 'VZ', 'OVB', 'CADO', 'RP', 'VV'];
const INACCESSIBLE_ROAD_SECTION_COLOR = '#d95f02';
const INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR = '#7570b3';
const ACCESSIBLE_ROAD_SECTION_COLOR = '#1b9e77';
const LINE_OPACITY = 0.5;

const ONE_WAY_ARROW_SIZE = 0.5;
const ONE_WAY_ARROW_OPACITY = 0.4;
const ONE_WAY_ARROW_SPACING_MAX = 200;
const ONE_WAY_ARROW_SPACING_MIN = 70;
const ONE_WAY_DRIVING_DIRECTION = 'H';

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
          id: 'accessibility',
          source: this.sourceId,
          'source-layer': this.sourceLayer,
          type: 'line',
          minzoom: MIN_ZOOM,
          layout: {
            'line-cap': 'butt',
            'line-join': 'bevel',
          },
          paint: {
            'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 15, 8],
            'line-color': [
              'case',
              ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]],
              INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
              ACCESSIBLE_ROAD_SECTION_COLOR,
            ],
            'line-opacity': LINE_OPACITY,
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

  updateLayerStyles(map: Map, inaccessibleRoadSections: InaccessibleRoadSection[]) {
    const inaccessibleRoadSectionIds = inaccessibleRoadSections.map((section) => section.roadSectionId);
    if (map.getLayer('accessibility')) {
      map.setPaintProperty('accessibility', 'line-color', [
        'case',
        ['in', ['get', 'roadSectionId'], ['literal', inaccessibleRoadSectionIds]],
        INACCESSIBLE_ROAD_SECTION_COLOR,
        ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]],
        INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
        ACCESSIBLE_ROAD_SECTION_COLOR,
      ]);
    }
  }

  onClick(event: clickEvent): void {
    console.log('Accessibility road clicked', event.features);
  }
}
