import { InaccessibleRoadSection } from '@shared/models';
import { AccessibilityDataService } from '@shared/services';
import { ExpressionSpecification, LayerSpecification, Map } from 'maplibre-gl';
import { combineLatest, filter, takeUntil } from 'rxjs';
import { MapLayer } from '../base/map-layer';
import {
  ACCESSIBLE_ROAD_SECTION_COLOR,
  INACCESSIBLE_CARRIAGEWAY_TYPE_COLOR,
  INACCESSIBLE_ROAD_SECTION_COLOR,
} from '../constants';

const MIN_ZOOM = 7;
export const INACCESSIBLE_CARRIAGEWAY_TYPES = ['BU', 'BUS', 'CADO', 'FP', 'OVB', 'RP', 'VDF', 'VDV', 'VP', 'VV', 'VZ'];
const INACTIVE_MUNICIPALITY_COLOR = '#002633';
const LINE_OPACITY = 1;

export class AccessibilityLayer extends MapLayer {
  constructor(map: Map, sourceId: string, accessibilityDataService: AccessibilityDataService) {
    super(map, sourceId);

    combineLatest([
      accessibilityDataService.inaccessibleRoadSections$,
      accessibilityDataService.selectedMunicipalityId$,
    ])
      .pipe(
        filter(([, municipalityId]) => !!municipalityId),
        takeUntil(this.unsubscribe),
      )
      .subscribe(([inaccessibleRoadSections, selectedMunicipalityId]) => {
        this.updateStyles(inaccessibleRoadSections, selectedMunicipalityId!);
      });
  }

  protected getSpecification(): Partial<LayerSpecification> {
    return {
      id: this.id, // Unique identifier for the layer
      source: this.sourceId, // Source ID for the layer data
      'source-layer': 'roadSections', // Specific layer within the source (usually for vector sources)
      type: 'line', // Type of layer; in this case, it’s a line layer
      minzoom: MIN_ZOOM, // Minimum zoom level at which this layer is visible
      layout: {
        // Layout properties for the layer
        'line-cap': 'butt', // Specifies how the endpoints of lines are rendered
        'line-join': 'bevel', // Specifies how two connected line segments are joined
      },
      paint: {
        // Paint properties defining the appearance of the layer
        'line-width': [
          // The width of the line varies based on the zoom level
          'interpolate', // Interpolation function to create smooth transitions
          ['linear'], // Specifies a linear interpolation
          ['zoom'], // The zoom level is the input for interpolation
          10, // Zoom level at which the first width is applied
          this.lineWidthCondition(2, 1, 0.5), // Width for zoom level 10
          16, // Zoom level at which the second width is applied
          this.lineWidthCondition(9, 4.5, 3), // Width for zoom level 16
        ],
        'line-opacity': 0, // Initial opacity of the lines (fully transparent)
      },
    };
  }

  private lineWidthCondition(thick: number, normal: number, thin: number): ExpressionSpecification {
    return [
      'case', // Begins a conditional expression
      [
        'all', // All conditions must be true
        ['!', ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]]], // Check if carriagewayTypeCode is NOT in the inaccessible types
        ['<=', ['to-number', ['get', 'functionalRoadClass']], 3], // Check if functionalRoadClass is less than or equal to 3
      ],
      thick, // If conditions are true, use the thick width
      [
        'all', // Another set of conditions
        ['!', ['in', ['get', 'carriagewayTypeCode'], ['literal', INACCESSIBLE_CARRIAGEWAY_TYPES]]], // Again, check for non-inaccessible types
        [
          'all', // Check if functionalRoadClass is between 4 and 7, inclusive
          ['>=', ['to-number', ['get', 'functionalRoadClass']], 4], // Check if functionalRoadClass is greater than or equal to 4
          ['<=', ['to-number', ['get', 'functionalRoadClass']], 7], // Check if functionalRoadClass is less than or equal to 7
        ],
      ],
      normal, // If this set of conditions is true, use the normal width
      // default
      thin, // If none of the conditions are met, use the thin width
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
      this.map.setPaintProperty(this.id, 'line-opacity', LINE_OPACITY);
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
