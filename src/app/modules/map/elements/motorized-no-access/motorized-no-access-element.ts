import { Map } from 'maplibre-gl';
import { MapElement } from '../base';
import { MotorizedNoAccessSource } from '@modules/map/elements/motorized-no-access/motorized-no-access-source';
import { AccessibilityFilterService } from '@shared/services';

export class MotorizedNoAccessElement extends MapElement {
  constructor(map: Map, accessibilityFilterService: AccessibilityFilterService) {
    super(map);

    this.sources = [new MotorizedNoAccessSource(map, accessibilityFilterService)];
  }
}
