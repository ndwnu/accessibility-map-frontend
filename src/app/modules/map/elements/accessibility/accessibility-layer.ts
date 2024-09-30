import { InaccessibleRoadSection } from '@shared/models';
import { AccessibilityDataService } from '@shared/services';
import { ExpressionSpecification, LayerSpecification, Map } from 'maplibre-gl';
import { combineLatest, filter } from 'rxjs';
import { MapLayer } from '../base/map-layer';
import {
  ACCESSIBLE_ROAD_SECTION_COLOR,
  INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
  INACCESSIBLE_ROAD_SECTION_COLOR,
} from '../constants';

const MIN_ZOOM = 7;
export const INACCESSIBLE_CARRIAGEWAY_TYPES = ['BU', 'BUS', 'CADO', 'FP', 'OVB', 'RP', 'VDF', 'VDV', 'VP', 'VV', 'VZ'];
const INACTIVE_MUNICIPALITY_COLOR = '#939393';
const LINE_OPACITY = 0.5;

export class AccessibilityLayer extends MapLayer {
  constructor(map: Map, sourceId: string, accessibilityDataService: AccessibilityDataService) {
    super(map, sourceId);

    // Todo: add unsubscribe logic
    combineLatest([
      accessibilityDataService.inaccessibleRoadSections$,
      accessibilityDataService.selectedMunicipalityId$,
    ])
      .pipe(filter(([, municipalityId]) => !!municipalityId))
      .subscribe(([inaccessibleRoadSections, selectedMunicipalityId]) => {
        this.updateStyles(inaccessibleRoadSections, selectedMunicipalityId!);
      });
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id,
      source: 'roadSections',
      'source-layer': 'roadSections',
      type: 'line',
      minzoom: MIN_ZOOM,
      layout: {
        'line-cap': 'butt',
        'line-join': 'bevel',
      },
      paint: {
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8,
          this.lineWidthCondition(3, 1.5, 1),
          16,
          this.lineWidthCondition(9, 4.5, 3),
        ],
        'line-opacity': 0,
      },
    };
  }

  private lineWidthCondition(thick: number, normal: number, thin: number): ExpressionSpecification {
    return [
      'case',
      [
        'all',
        ['!', ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]]],
        ['<=', ['to-number', ['get', 'functionalRoadClass']], 3],
      ],
      thick,
      [
        'all',
        ['!', ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]]],
        ['>=', ['to-number', ['get', 'functionalRoadClass']], 4],
      ],
      normal,
      // default
      thin,
    ];
  }

  protected updateStyles(inaccessibleRoadSections: InaccessibleRoadSection[], municipality: string) {
    const inaccessibleRoadSectionIds = inaccessibleRoadSections
      .filter((section) => {
        const bothDirectionsInaccessible = section.forwardAccessible === false && section.backwardAccessible === false;
        const forwardInaccessible = section.forwardAccessible === false && section.backwardAccessible === undefined;
        const backwardInaccessible = section.forwardAccessible === undefined && section.backwardAccessible === false;
        return bothDirectionsInaccessible || forwardInaccessible || backwardInaccessible;
      })
      .map((section) => section.roadSectionId);

    const municipalityId = Number(municipality.replace(/^GM/, '').replace(/^0+/, ''));

    if (this.styleLayer) {
      this.map.setPaintProperty(this.id, 'line-opacity', [
        'case',
        ['!=', ['get', 'municipalityId'], municipalityId],
        0,
        LINE_OPACITY,
      ]);
      this.map.setPaintProperty(this.id, 'line-color', [
        'case',
        ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]],
        INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
        ['!=', ['get', 'municipalityId'], municipalityId],
        INACTIVE_MUNICIPALITY_COLOR,
        ['in', ['get', 'roadSectionId'], ['literal', inaccessibleRoadSectionIds]],
        INACCESSIBLE_ROAD_SECTION_COLOR,
        // default
        ACCESSIBLE_ROAD_SECTION_COLOR,
      ]);
    }
  }
}
