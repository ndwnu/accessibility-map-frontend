// production
window.environment = {
  production: true,
  apiBaseUrl: '/api',
  baseUrl: '${BASE_URL}',
  mapStyles: {
    default: '${MAP_STYLES_DEFAULT_URL}',
  },
  georgeUrl: '${GEORGE_URL}',
  vectorTiles: {
    NWB: '${NWB_ROAD_SECTIONS_VECTOR_URL}',
  },
  geoJson: {
    trafficSignUrl: '${NWB_TRAFFIC_SIGN_CURRENT_STATE_URL}',
  },
  nls: {
    accessibilityUrl: '${NLS_ACCESSIBILITY_URL}',
  },
  pdok: {
    roadDataUrl: '${PDOK_ROAD_DATA_URL}',
  },
  rdw: {
    registeredVehicleUrl: '${RDW_REGISTERED_VEHICLE_URL}',
    axleUrl: '${RDW_AXLE_URL}',
  },
};
