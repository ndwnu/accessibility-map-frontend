import { BerMapElement, BerMapElementConfig } from '@modules/map/elements/base';
import { MotorizedNoAccessSource } from '@modules/map/elements/motorized-no-access/motorized-no-access-source';
import { AccessibilityFilterService } from '@shared/services';

export class MotorizedNoAccessElement extends BerMapElement {
  constructor(config: BerMapElementConfig, accessibilityFilterService: AccessibilityFilterService) {
    super(config);

    this.sources = [new MotorizedNoAccessSource(config, accessibilityFilterService)];
    this.isVisible = true;
  }
}
