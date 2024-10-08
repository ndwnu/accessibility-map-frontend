// production
window.environment = {
  production: true,
  apiBaseUrl: '/api',
  baseUrl: '${BASE_URL}',
  mapStyles: {
    default: '${MAP_STYLES_DEFAULT_URL}',
  },
  georgeUrl: '${GEORGE_URL}',
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
    axleUrl: '${RDW_AXLE_URL}',
    plateCheckUrl: '${RDW_PLATE_CHECK_URL}',
    registeredVehicleUrl: '${RDW_REGISTERED_VEHICLE_URL}',
  },
};
