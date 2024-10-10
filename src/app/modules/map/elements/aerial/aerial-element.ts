import { AerialSource } from '@modules/map/elements/aerial/aerial-source';
import { MapElement } from '@modules/map/elements/base';
import { Map } from 'maplibre-gl';

export class AerialElement extends MapElement {
  constructor(map: Map) {
    super(map);
    this.sources = [new AerialSource(map)];
  }
}
