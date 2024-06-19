import { InaccessibleRoadSection } from '@shared/models';
import { AccessibilityDataService } from '@shared/services';
import { Map, LayerSpecification } from 'maplibre-gl';
import { combineLatest, filter } from 'rxjs';
import { clickEvent, MapLayer } from '../base/map-layer';
import {
  ACCESSIBLE_ROAD_SECTION_COLOR,
  INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
  INACCESSIBLE_ROAD_SECTION_COLOR,
} from '../constants';

const ACCESSIBILITY_LAYER_ID = 'accessibility-layer';

const MIN_ZOOM = 7;
const INACCESSIBLE_CARRIAGEWAY_TYPES = ['BU', 'BUS', 'FP', 'VP', 'VZ', 'OVB', 'CADO', 'RP', 'VV'];
const INACTIVE_MUNICIPALITY_COLOR = '#939393';
const LINE_OPACITY = 0.5;

export class AccessibilityLayer extends MapLayer {
  constructor(map: Map, accessibilityDataService: AccessibilityDataService) {
    super(map);

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

  get id(): string {
    return ACCESSIBILITY_LAYER_ID;
  }

  override onClick(event: clickEvent): void {
    console.log('Accessibility road clicked', event.features);
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
    };
  }

  protected updateStyles(inaccessibleRoadSections: InaccessibleRoadSection[], municipality: string) {
    const inaccessibleRoadSectionIds = inaccessibleRoadSections
      .filter((section) => section.backwardAccessible === false && section.forwardAccessible === false)
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
        ACCESSIBLE_ROAD_SECTION_COLOR,
      ]);
      this.map.setPaintProperty(this.id, 'line-width', [
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
}
