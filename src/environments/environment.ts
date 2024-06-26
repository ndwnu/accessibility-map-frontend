// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiBaseUrl: '/api',
  baseUrl: 'http://localhost:4203',
  georgeUrl: 'https://wegkenmerken.staging.ndw.nu',
  mapStyles: {
    default: 'https://maps.staging.ndw.nu/styles/osm-front-office-light-with-nwb-roads.json',
  },
  vectorTiles: {
    NWB: 'https://maps.ndw.nu/api/v1/nwb/latest/mbtiles/roadSections/',
  },
  geoJson: {
    trafficSignUrl: 'https://data.staging.ndw.nu/api/rest/static-road-data/traffic-signs/v3/current-state',
  },
  nls: {
    accessibilityUrl: 'https://nls.staging.ndw.nu/api/rest/static-road-data/accessibility-map/v1',
  },
  pdok: {
    roadDataUrl: 'https://api.pdok.nl/bzk/locatieserver/search/v3_1',
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
