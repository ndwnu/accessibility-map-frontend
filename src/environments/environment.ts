// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  mock: false,
  apiBaseUrl: '/api',
  baseUrl: 'http://localhost:4203',
  georgeUrl: 'https://wegkenmerken.staging.ndw.nu',
  ndw: {
    trafficSignUrl: 'https://data.staging.ndw.nu/api/rest/static-road-data/traffic-signs/v4/current-state',
    accessibilityUrl: 'https://data.staging.ndw.nu/api/rest/static-road-data/accessibility-map/v2',
    roadSectionsUrl: 'https://maps.ndw.nu/api/v1/nwb/latest/mbtiles/roadSections/tiles/{z}/{x}/{y}.pbf',
    baseMap: 'https://maps.ndw.nu/styles/ndw-basemap/dev/style.json',
    spriteUrl: 'https://maps.ndw.nu/styles/sprites/osm-default/osm-default',
    glyphsUrl: 'https://maps.ndw.nu/styles/glyphs/{fontstack}/{range}.pbf',
  },
  pdok: {
    roadDataUrl: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1',
  },
  rdw: {
    axleUrl: 'https://opendata.rdw.nl/resource/3huj-srit.json',
    plateCheckUrl: 'https://ovi.rdw.nl/default.aspx?kenteken={plateNumber}',
    registeredVehicleUrl: 'https://opendata.rdw.nl/resource/m9d7-ebf2.json',
    vehicleClassUrl: 'https://opendata.rdw.nl/resource/8ys7-d773.json',
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
