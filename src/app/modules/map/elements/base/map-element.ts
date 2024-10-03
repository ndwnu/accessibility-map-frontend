import { Map } from 'maplibre-gl';
import { MapSource } from './map-source';
import { Subject } from 'rxjs';

export abstract class MapElement {
  sources: MapSource[] = [];
  protected unsubscribe = new Subject<void>();

  constructor(protected readonly map: Map) {
    this.map = map;
  }

  onInit() {
    this.sources.forEach((source) => source.onInit());
  }

  onDestroy() {
    this.sources.forEach((source) => source.onDestroy());

    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setVisible(visible: boolean) {
    this.sources.forEach((source) => source.setVisible(visible));
  }
}
