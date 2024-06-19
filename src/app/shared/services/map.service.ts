import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { MAP_MIN_ZOOM } from '@modules/map/elements/constants';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BOUNDS_NL } from '@shared/constants/map.constants';
import { LngLatBoundsLike, Map } from 'maplibre-gl';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class MapService {
  map?: Map;

  createMap(container: HTMLElement): Map {
    return (this.map = new Map({
      container,
      style: environment.mapStyles['default'],
      interactive: true,
      bounds: BOUNDS_NL,
      maxZoom: 18,
      minZoom: MAP_MIN_ZOOM,
    }));
  }

  fitBounds(bounds: LngLatBoundsLike) {
    this.map?.fitBounds(bounds, {
      padding: 0,
      duration: 400,
    });
  }
}
