// production
window.environment = {
  production: true,
  apiBaseUrl: '/api',
  baseUrl: '${BASE_URL}',
  mapStyles: {
    default: '${MAP_STYLES_DEFAULT_URL}',
  },
  vectorTiles: {
    NWB: '${NWB_ROAD_SECTIONS_VECTOR_URL}',
  },
  nls: {
    accessibilityUrl: '${NLS_ACCESSIBILITY_URL}',
  },
  rdw: {
    registeredVehicleUrl: '${RDW_REGISTERED_VEHICLE_URL}',
    axleUrl: '${RDW_AXLE_URL}',
  },
};
