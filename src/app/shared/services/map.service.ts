import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { MAP_MIN_ZOOM } from '@modules/map/elements/constants';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BOUNDS_NL } from '@shared/constants/map.constants';
import { LngLatBoundsLike, LngLatLike, Map } from 'maplibre-gl';

export const MAP_DEFAULT_ZOOM = 15;

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class MapService {
  map?: Map;

  createMap(container: HTMLElement): Map {
    return (this.map = new Map({
      bounds: BOUNDS_NL,
      container,
      dragRotate: false,
      interactive: true,
      maxZoom: 18,
      minZoom: MAP_MIN_ZOOM,
      style: environment.mapStyles['default'],
    }));
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
