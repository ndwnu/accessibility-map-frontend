import { VectorSource } from '@shared/constants/map.constants';

export interface Environment {
  production: boolean;
  apiBaseUrl: string;
  baseUrl: string;
  georgeUrl: string;
  mapStyles: {
    [key: string]: string;
  };
  geoJson: {
    trafficSignUrl: string;
  };
  nls: {
    accessibilityUrl: string;
  };
  pdok: {
    roadDataUrl: string;
  };
  rdw: {
    axleUrl: string;
    plateCheckUrl: string;
    registeredVehicleUrl: string;
  };
}
