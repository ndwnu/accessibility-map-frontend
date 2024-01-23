import { Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BOUNDS_NL } from '@shared/constants/map.constants';
import bbox from '@turf/bbox';

import { Feature, GeoJsonObject } from 'geojson';
import { LngLatBoundsLike, Map } from 'maplibre-gl';

export const MAP_MIN_ZOOM = 7;
const STYLE_URL = 'https://maps.ndw.nu/styles/osm-default-with-nwb-roads.json';

@UntilDestroy()
@Injectable()
export class MapService {
  createMap(container: HTMLElement): Map {
    return new Map({
      container,
      style: STYLE_URL,
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

  fitGeoJsonBounds(map: Map, geometry: GeoJsonObject) {
    const bounds = bbox(geometry) as LngLatBoundsLike;
    map.fitBounds(bounds, {
      padding: 30,
      maxZoom: 15,
      duration: 0,
    });
  }

  private getMapStyles(): any {
    return {
      version: 8,
      center: [5.41, 52.15],
      sources: {},
      layers: [],
      glyphs: 'https://maps.ndw.nu/styles/glyphs/{fontstack}/{range}.pbf',
    };
  }
}
