import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { MAP_MIN_ZOOM } from '@modules/map/elements/constants';
import { BOUNDS_NL } from '@shared/constants/map.constants';
import { LngLatBoundsLike, LngLatLike, Map } from 'maplibre-gl';

export const MAP_DEFAULT_ZOOM = 15;

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map?: Map;

  createMap(container: HTMLElement): Map {
    this.map = new Map({
      bounds: BOUNDS_NL,
      container,
      dragRotate: false,
      interactive: true,
      maxZoom: 18,
      minZoom: MAP_MIN_ZOOM,
      style: {
        version: 8,
        center: [5.41, 52.15],
        sources: {},
        layers: [],
        sprite: environment.ndw.spriteUrl,
        glyphs: environment.ndw.glyphsUrl,
      },
    });
    return this.map;
  }

  fitBounds(bounds: LngLatBoundsLike) {
    this.map?.fitBounds(bounds, {
      padding: 0,
      duration: 400,
    });
  }

  center(mapCenter: LngLatLike, mapZoom?: number) {
    this.map?.jumpTo({
      center: mapCenter,
      zoom: mapZoom ?? MAP_DEFAULT_ZOOM,
    });
  }
}
