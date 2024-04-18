import { Injectable } from '@angular/core';
import { VECTOR_SOURCE_META, VectorSource, VectorSourceMeta } from '@shared/constants/map.constants';
import { InaccessibleRoadSection } from '@shared/models';
import { DataDrivenPropertyValueSpecification, LayerSpecification, Map } from 'maplibre-gl';

const INACCESSIBLE_CARRIAGEWAY_TYPES = ['BU', 'BUS', 'FP', 'VP', 'VZ', 'OVB', 'CADO', 'RP', 'VV'];
const INACCESSIBLE_ROAD_SECTION_COLOR = '#FF0044';
const INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR = '#FF8866';
const ACCESSIBLE_ROAD_SECTION_COLOR = '#558844';
const LINE_OPACITY = 0.5;

@Injectable()
export class MapLayerService {
  private readonly lineLayout: LayerSpecification['layout'] = {
    'line-cap': 'butt',
    'line-join': 'bevel',
  };
  private readonly linePaint = {
    'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 15, 8] as DataDrivenPropertyValueSpecification<number>,
  };

  addVectorLayers(map: Map) {
    VECTOR_SOURCE_META.forEach((source) => {
      this.generateVectorLayers(source, true).forEach((layer) => {
        map.addLayer(layer);
      });
    });

    map.addLayer(this.generateOneWayArrowLayer());
  }

  generateVectorLayers(source: VectorSourceMeta, visible: boolean): LayerSpecification[] {
    return [
      {
        id: source.id,
        type: source.layerType,
        source: source.sourceName,
        'source-layer': source.sourceLayer,
        layout: {
          ...this.lineLayout,
          visibility: visible ? 'visible' : 'none',
        },
        paint: {
          ...this.linePaint,
          'line-color': [
            'case',
            ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]],
            INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
            ACCESSIBLE_ROAD_SECTION_COLOR,
          ],
          'line-opacity': LINE_OPACITY,
        },
      },
    ] as LayerSpecification[];
  }

  showInaccesibleRoadSections(map: Map, inaccessibleRoadSections: InaccessibleRoadSection[]) {
    const inaccessibleRoadSectionIds = inaccessibleRoadSections.map((section) => section.roadSectionId);
    const nwbSourceId: VectorSource = 'NWB';
    if (map.getLayer(nwbSourceId)) {
      map.setPaintProperty(nwbSourceId, 'line-color', [
        'case',
        ['in', ['get', 'roadSectionId'], ['literal', inaccessibleRoadSectionIds]],
        INACCESSIBLE_ROAD_SECTION_COLOR,
        ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]],
        INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
        ACCESSIBLE_ROAD_SECTION_COLOR,
      ]);
    }
  }

  private generateOneWayArrowLayer(): LayerSpecification {
    const ONE_WAY_ARROW_SIZE = 0.5;
    const ONE_WAY_ARROW_OPACITY = 0.3;
    const ONE_WAY_ARROW_SPACING_MAX = 200;
    const ONE_WAY_ARROW_SPACING_MIN = 70;
    const ONE_WAY_DRIVING_DIRECTION = 'H';

    return {
      id: 'oneway-arrow',
      type: 'symbol',
      source: 'roadSections',
      'source-layer': 'roadSections',
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
