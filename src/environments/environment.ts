// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  environmentType: 'local',
  apiBaseUrl: '/api',
  baseUrl: 'http://localhost:4200',
  mapStyles: {
    nwbRoadSection: 'https://maps.ndw.nu/styles/layers/nwb/roadSections/default.json',
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
