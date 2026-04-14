import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  mock: true,
  apiBaseUrl: '/api',
  baseUrl: 'http://localhost:4203',
  georgeUrl: 'https://wegkenmerken.staging.ndw.nu',
  ndw: {
    trafficSignUrl: 'https://data.staging.ndw.nu/api/rest/static-road-data/traffic-signs/v4/current-state',
    // Uncomment the line below to use the data from mockoon
    // accessibilityUrl: 'http://localhost:3001/api/rest/static-road-data/accessibility-map/v1',
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
