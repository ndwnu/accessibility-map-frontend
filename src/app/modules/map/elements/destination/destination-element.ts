import { DestinationSource } from '@modules/map/elements/destination/destination-source';
import { BerMapElement, BerMapElementConfig } from '@modules/map/elements/base';
import { AccessibilityDataService, MapPopupService } from '@shared/services';

export class DestinationElement extends BerMapElement {
  constructor(
    config: BerMapElementConfig,
    accessibilityDataService: AccessibilityDataService,
    mapPopupService: MapPopupService,
  ) {
    super(config);
    this.sources = [new DestinationSource(config, accessibilityDataService, mapPopupService)];
    this.isVisible = true;
  }
}
