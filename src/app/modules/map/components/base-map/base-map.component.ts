import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Feature } from 'geojson';
import { CommonModule } from '@angular/common';
import { MapState } from '@shared/models';
import { NgChanges } from '@shared/types/ng-changes.type';
import { MapService } from '@shared/services/map.service';
import { MapElement } from '@modules/map/elements/base';
import { FilterSpecification, StyleImageMetadata, Map } from 'maplibre-gl';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export abstract class BaseMapComponent implements OnChanges, AfterViewInit, OnDestroy {
  readonly _map = inject(MapService);

  @Output() featureClick: EventEmitter<Feature[]> = new EventEmitter();
  @Output() mapIdle: EventEmitter<MapState> = new EventEmitter();

  @ViewChild('map', { static: true }) mapElementRef!: ElementRef;

  @Input() expressions: FilterSpecification | undefined = undefined;

  map!: Map;
  mapElements: MapElement[] = [];

  ngOnChanges(changes: NgChanges<BaseMapComponent>) {
    if (changes.expressions?.currentValue) {
      this.addExpressionsToLayer(this.expressions);
    }
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
    this.map = this._map.createMap(this.mapElementRef.nativeElement);
  }
}
