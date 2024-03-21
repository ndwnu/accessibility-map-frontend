import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BOUNDS_NL } from '@shared/constants/map.constants';
import bbox from '@turf/bbox';

import { Feature } from 'geojson';
import { LngLatBoundsLike, Map } from 'maplibre-gl';

export const MAP_MIN_ZOOM = 7;

@UntilDestroy()
@Injectable()
export class MapService {
  createMap(container: HTMLElement): Map {
    return new Map({
      container,
      style: environment.mapStyles['default'],
      interactive: true,
      bounds: BOUNDS_NL,
      maxZoom: 18,
      minZoom: MAP_MIN_ZOOM,
    });
  }

  fitBounds(map: Map, features: Feature[]) {
    if (features?.length) {
      const featureCollection = {
        type: 'FeatureCollection',
        features,
      };
      const bounds = bbox(featureCollection) as LngLatBoundsLike;
      map.fitBounds(bounds, {
        padding: 30,
        maxZoom: 15,
        duration: 0,
      });
    }
  }
}
