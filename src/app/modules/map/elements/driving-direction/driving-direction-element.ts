import { DrivingDirectionSource } from '@modules/map/elements/driving-direction/driving-direction-source';
import { BerMapElement, BerMapElementConfig } from '@modules/map/elements/base';

export class DrivingDirectionElement extends BerMapElement {
  constructor(config: BerMapElementConfig) {
    super(config);

    this.sources = [new DrivingDirectionSource(config)];
    this.isVisible = true;
  }
}
