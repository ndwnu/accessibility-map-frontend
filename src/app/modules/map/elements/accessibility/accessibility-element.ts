import { BerMapElement, BerMapElementConfig } from '../base';
import { AccessibilitySource } from '@modules/map/elements/accessibility/accessibility-source';
import { AccessibilityDataService } from '@shared/services';

export class AccessibilityElement extends BerMapElement {
  constructor(config: BerMapElementConfig, accessibilityDataService: AccessibilityDataService) {
    super(config);

    this.sources = [new AccessibilitySource(config, accessibilityDataService)];
    this.isVisible = true;
  }
}
