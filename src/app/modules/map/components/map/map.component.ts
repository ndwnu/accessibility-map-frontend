import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { MapElement } from '@modules/map/elements/base';
import { MapState } from '@shared/models';
import { MapService } from '@shared/services/map.service';
import { Feature } from 'geojson';
import { FilterSpecification, StyleImageMetadata, Map } from 'maplibre-gl';

@Component({
  standalone: true,
  template: '',
})
export abstract class MapComponent implements AfterViewInit, OnDestroy {
  readonly #map = inject(MapService);

  expressions = input<FilterSpecification>();
  featureClick = output<Feature[]>();
  mapIdle = output<MapState>();

  mapElementRef = viewChild.required<ElementRef>('map');

  map!: Map;
  mapElements: MapElement[] = [];

  constructor() {
    effect(() => {
      this.addExpressionsToLayer(this.expressions());
    });
  }

  ngAfterViewInit() {
    this.createMap();
    this.addButtons();
    this.map.once('render', () => this.onRenderMap());
    this.map.once('load', () => this.initiateMapLoading());
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  resizeMap() {
    this.map?.resize();
  }

  addExpressionsToLayer(expressions: FilterSpecification | undefined) {
    const layerId = 'NWB';
    const existingLayer = this.map?.getLayer(layerId);
    if (this.map && existingLayer) {
      this.map.setFilter(layerId, expressions);
    }
  }

  protected loadImage(name: string, path: string, options?: Partial<StyleImageMetadata>) {
    if (this.map.hasImage(name)) {
      this.map.removeImage(name);
    }

    this.map.loadImage(path, (error, image) => {
      if (!image || error) {
        console.error(`Failed to load ${name} image:`, error);
        return;
      }

      this.map.addImage(name, image, options);
    });
  }

  private onRenderMap() {}

  protected abstract addButtons(): void;
  protected abstract onLoadMap(): void;

  protected initiateMapLoading() {
    this.onLoadMap();
    this.resizeMap();
  }

  private createMap() {
    this.map = this.#map.createMap(this.mapElementRef().nativeElement);
  }
}
