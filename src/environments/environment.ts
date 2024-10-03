// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiBaseUrl: '/api',
  baseUrl: 'http://localhost:4203',
  georgeUrl: 'https://wegkenmerken.staging.ndw.nu',
  ndw: {
    trafficSignUrl: 'https://data.staging.ndw.nu/api/rest/static-road-data/traffic-signs/v3/current-state',
    accessibilityUrl: 'https://data.staging.ndw.nu/api/rest/static-road-data/accessibility-map/v1',
    roadSectionsUrl: 'https://maps.ndw.nu/api/v1/nwb/latest/mbtiles/roadSections/tiles/{z}/{x}/{y}.pbf',
    spriteUrl: 'https://maps.ndw.nu/styles/sprites/osm-default/osm-default',
    glyphsUrl: 'https://maps.ndw.nu/styles/glyphs/{fontstack}/{range}.pbf',
  },
  pdok: {
    roadDataUrl: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1',
    brtTilesUrl:
      'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?layer=grijs&style=default&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}',
  },
  rdw: {
    axleUrl: 'https://opendata.rdw.nl/resource/3huj-srit.json',
    plateCheckUrl: 'https://ovi.rdw.nl/default.aspx?kenteken={plateNumber}',
    registeredVehicleUrl: 'https://opendata.rdw.nl/resource/m9d7-ebf2.json',
  },
  ...window.environment,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
