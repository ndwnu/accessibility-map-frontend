// production
window.environment = {
  production: true,
  apiBaseUrl: '/api',
  baseUrl: '${BASE_URL}',
  georgeUrl: '${GEORGE_URL}',
  ndw: {
    trafficSignUrl: '${NDW_TRAFFIC_SIGN_CURRENT_STATE_URL}',
    accessibilityUrl: '${NDW_ACCESSIBILITY_URL}',
    roadSectionsUrl: '${NDW_ROAD_SECTIONS_URL}',
    spriteUrl: '${NDW_SPRITE_URL}',
    glyphsUrl: '${NDW_GLYPHS_URL}',
  },
  pdok: {
    roadDataUrl: '${PDOK_ROAD_DATA_URL}',
    aerialTilesUrl: '${PDOK_AERIAL_TILES_URL}',
    brtTilesUrl: '${PDOK_BRT_TILES_URL}',
  },
  rdw: {
    axleUrl: '${RDW_AXLE_URL}',
    plateCheckUrl: '${RDW_PLATE_CHECK_URL}',
    registeredVehicleUrl: '${RDW_REGISTERED_VEHICLE_URL}',
  },
};
