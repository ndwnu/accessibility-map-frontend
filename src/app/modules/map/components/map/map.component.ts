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
import { MapState } from '@shared/models';
import { MapService } from '@shared/services/map.service';
import { Feature } from 'geojson';
import { FilterSpecification, StyleImageMetadata, Map } from 'maplibre-gl';

@Component({ standalone: true, template: '' })
export abstract class MapComponent implements AfterViewInit, OnDestroy {
  readonly #map = inject(MapService);

  expressions = input<FilterSpecification>();
  featureClick = output<Feature[]>();
  mapIdle = output<MapState>();

  mapElementRef = viewChild.required<ElementRef>('map');

  map!: Map;

  constructor() {
    effect(() => {
      this.addExpressionsToLayer(this.expressions());
    });
  }

  ngAfterViewInit() {
    this.createMap();
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

  protected async loadImage(name: string, path: string, options?: Partial<StyleImageMetadata>) {
    if (this.map.hasImage(name)) {
      this.map.removeImage(name);
    }

    try {
      const image = await this.map.loadImage(path);
      this.map.addImage(name, image.data, options);
    } catch (error) {
      console.error(`Failed to load ${name} image:`, error);
      return;
    }
  }

  protected abstract onLoadMap(): void;

  protected initiateMapLoading() {
    this.onLoadMap();
    this.resizeMap();
  }

  private createMap() {
    this.map = this.#map.createMap(this.mapElementRef().nativeElement);
  }
}
