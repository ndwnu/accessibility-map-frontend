import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { MAP_DEFAULT_ZOOM, MAP_MAX_ZOOM, MAP_MIN_ZOOM } from '@modules/map/elements/constants';
import { BOUNDS_NL } from '@shared/constants/map.constants';
import { LngLatBoundsLike, LngLatLike, Map } from 'maplibre-gl';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: Map;

  private readonly LNG_LAT_BOUNDS_DECIMALS = 6; // Limit decimal places for longitude and latitude coords to prevent long floats breaking MapLibre bounds
  private readonly PADDING = 0.05; // Padding for comfortable map usage, preventing restriction to screen corners

  createMap(container: HTMLElement): Map {
    this.map = new Map({
      bounds: BOUNDS_NL,
      container,
      dragRotate: false,
      interactive: true,
      maxZoom: MAP_MAX_ZOOM,
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

  private ensureMapInitialized() {
    if (!this.map) throw new Error("Map is not initialized. Call 'createMap' first.");
  }

  // This function should always be called first! To ensure that the map is initialized
  setMaxBounds(bounds: LngLatBoundsLike) {
    this.ensureMapInitialized();

    this.setPaddedMaxBounds(bounds, this.PADDING);
  }

  setCenter(center: LngLatLike) {
    this.map.setCenter(center);
  }

  jumpTo(mapCenter: LngLatLike, mapZoom?: number) {
    this.map.jumpTo({
      center: mapCenter,
      zoom: mapZoom ?? MAP_DEFAULT_ZOOM,
    });
  }

  private setPaddedMaxBounds(bounds: LngLatBoundsLike, padding: number) {
    // Cast bounds to the expected tuple format
    const [[swLng, swLat], [neLng, neLat]] = bounds as [[number, number], [number, number]];

    // Create new bounds with padding applied
    const paddedBounds: LngLatBoundsLike = [
      this.addPaddingToBounds(swLng, swLat, -padding), // Southwest corner with negative padding
      this.addPaddingToBounds(neLng, neLat, padding), // Northeast corner with positive padding
    ];

    this.map.setMaxBounds(null);
    this.map.setMaxBounds(paddedBounds);
  }

  private addPaddingToBounds(lng: number, lat: number, padding: number): [number, number] {
    return [
      parseFloat((lng + padding).toFixed(this.LNG_LAT_BOUNDS_DECIMALS)), // Adjust the longitude
      parseFloat((lat + padding).toFixed(this.LNG_LAT_BOUNDS_DECIMALS)), // Adjust the latitude
    ];
  }
}
