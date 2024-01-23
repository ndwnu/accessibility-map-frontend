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
  signal,
  ViewChild,
} from '@angular/core';

import { Feature, GeoJsonObject } from 'geojson';

import { FilterSpecification, LngLatLike, Map } from 'maplibre-gl';
import { CommonModule } from '@angular/common';
import { MapState } from '@shared/models';
import { NgChanges } from '@shared/types/ng-changes.type';
import { MapService } from '@shared/services/map.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: ` <div #map class="map-container"></div> `,
  styles: [
    `
      #map {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    `,
  ],
})
export abstract class BaseMapComponent implements OnChanges, AfterViewInit, OnDestroy {
  readonly _map = inject(MapService);

  @Output() featureClick: EventEmitter<Feature[]> = new EventEmitter();
  @Output() mapIdle: EventEmitter<MapState> = new EventEmitter();

  @ViewChild('map', { static: true }) mapElement!: ElementRef;

  @Input() features: Feature[] = [];
  @Input() zoomPosition?: LngLatLike;
  @Input() mapState?: MapState;
  @Input() enableFeatureInteraction = true;
  @Input() enableMapIdle = true;
  @Input() expressions: FilterSpecification | undefined = undefined;

  map!: Map;
  private mapRendered = signal(false);

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
    this.map.once('load', () => this.onLoadMapBase());
    if (this.enableMapIdle) {
      this.map.on('idle', () => this.onIdle());
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  fitBounds() {
    if (this.map && this.features) {
      this._map.fitBounds(this.map, this.features);
    }
  }

  fitOrganizationBounds(geojson?: GeoJsonObject) {
    if (geojson) {
      this._map.fitGeoJsonBounds(this.map, geojson);
    }
  }

  addExpressionsToLayer(expressions: FilterSpecification | undefined) {
    const layerId = 'NWB';
    const existingLayer = this.map?.getLayer(layerId);
    if (this.map && existingLayer) {
      this.map.setFilter(layerId, expressions);
    }
  }

  private onRenderMap() {
    this.mapRendered.set(true);
    this.updateMapState();
  }

  protected abstract onLoadMap(): void;

  protected onLoadMapBase() {
    this.onLoadMap();

    if (this.zoomPosition) {
      this.zoomToLocation(this.zoomPosition);
    }
    this.resizeMap();
  }

  public resizeMap() {
    if (this.map) {
      this.map.resize();
    }
  }

  private onIdle() {
    this.mapIdle.emit({
      mapZoom: this.map.getZoom(),
      mapCenter: this.map.getCenter(),
      bounds: this.map.getBounds(),
    });
  }

  private zoomToLocation(lngLat: LngLatLike) {
    this.map?.jumpTo({
      center: lngLat,
      zoom: 16,
    });
  }

  private createMap() {
    this.map = this._map.createMap(this.mapElement.nativeElement);
  }

  private updateMapState() {
    if (this.mapState?.mapZoom && this.mapState?.mapCenter) {
      this.map.setZoom(this.mapState.mapZoom);
      this.map.setCenter(this.mapState.mapCenter);
    }
  }
}
