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
    baseMap: string;
    spriteUrl: string;
    glyphsUrl: string;
  };
  pdok: {
    roadDataUrl: string;
  };
  rdw: {
    axleUrl: string;
    plateCheckUrl: string;
    registeredVehicleUrl: string;
    vehicleClassUrl: string;
  };
}
