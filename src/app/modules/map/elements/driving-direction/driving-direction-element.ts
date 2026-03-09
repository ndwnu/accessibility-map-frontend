import { Map } from 'maplibre-gl';
import { MapElement } from '../base';
import { DrivingDirectionSource } from '@modules/map/elements/driving-direction/driving-direction-source';

export class DrivingDirectionElement extends MapElement {
  constructor(map: Map) {
    super(map);

    this.sources = [new DrivingDirectionSource(map)];
  }
}
