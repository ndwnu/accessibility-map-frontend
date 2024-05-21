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

import { FilterSpecification, LngLatLike, Map } from 'maplibre-gl';
import { CommonModule } from '@angular/common';
import { MapState } from '@shared/models';
import { NgChanges } from '@shared/types/ng-changes.type';
import { MapService } from '@shared/services/map.service';

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

  @Input() features: Feature[] = [];
  @Input() zoomPosition?: LngLatLike;
  @Input() mapState?: MapState;
  @Input() enableFeatureInteraction = true;
  @Input() enableMapIdle = true;
  @Input() expressions: FilterSpecification | undefined = undefined;

  map!: Map;

  ngOnChanges(changes: NgChanges<BaseMapComponent>) {
    if (changes?.zoomPosition?.currentValue) {
      this.zoomToLocation(this.zoomPosition!);
    }

    if (changes.expressions?.currentValue) {
      this.addExpressionsToLayer(this.expressions);
    }
  }

  ngAfterViewInit() {
    this.createMap();
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

  private onRenderMap() {}

  protected abstract onLoadMap(): void;

  protected initiateMapLoading() {
    this.onLoadMap();
    this.resizeMap();
  }

  private zoomToLocation(lngLat: LngLatLike) {
    this.map?.jumpTo({
      center: lngLat,
      zoom: 16,
    });
  }

  private createMap() {
    this.map = this._map.createMap(this.mapElementRef.nativeElement);
  }
}
