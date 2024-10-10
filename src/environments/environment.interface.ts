export interface Environment {
  production: boolean;
  mock?: boolean;
  apiBaseUrl: string;
  baseUrl: string;
  georgeUrl: string;
  ndw: {
    trafficSignUrl: string;
    accessibilityUrl: string;
    roadSectionsUrl: string;
    spriteUrl: string;
    glyphsUrl: string;
  };
  pdok: {
    roadDataUrl: string;
    aerialTilesUrl: string;
    brtTilesUrl: string;
  };
  rdw: {
    axleUrl: string;
    plateCheckUrl: string;
    registeredVehicleUrl: string;
  };
}
