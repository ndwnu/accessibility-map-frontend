import { Map, SourceSpecification } from 'maplibre-gl';
import { MapSource } from '../base/map-source';
import { AccessibilityLayer } from '@modules/map/elements/accessibility/accessibility-layer';
import { EMPTY_SOURCE_SPECIFICATION } from '@modules/map/elements/constants';
import { AccessibilityDataService } from '@shared/services';

export class AccessibilitySource extends MapSource {
  constructor(map: Map, accessibilityDataService: AccessibilityDataService) {
    super('accessibility', map);

    this.featureCollection$ = accessibilityDataService.roadAccessibility$;
    this.layers = [new AccessibilityLayer(map, this.id)];
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return EMPTY_SOURCE_SPECIFICATION;
  }
}
