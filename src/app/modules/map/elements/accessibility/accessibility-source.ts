import { SourceSpecification } from 'maplibre-gl';
import { BerMapSource } from '../base/map-source';
import { AccessibilityLayer } from '@modules/map/elements/accessibility/accessibility-layer';
import { EMPTY_SOURCE_SPECIFICATION } from '@modules/map/elements/constants';
import { AccessibilityDataService } from '@shared/services';
import { BerMapElementConfig } from '@modules/map/elements/base';

export class AccessibilitySource extends BerMapSource {
  constructor(config: BerMapElementConfig, accessibilityDataService: AccessibilityDataService) {
    super('accessibility', config);

    this.featureCollection$ = accessibilityDataService.roadAccessibility$;
    this.layers = [new AccessibilityLayer(config, this.id)];
  }

  protected getSpecification(): Partial<SourceSpecification> {
    return EMPTY_SOURCE_SPECIFICATION;
  }
}
