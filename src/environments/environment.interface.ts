import { VectorSource } from '@shared/constants/map.constants';

export interface Environment {
  production: boolean;
  apiBaseUrl: string;
  baseUrl: string;
  mapStyles: {
    [key: string]: string;
  };
  vectorTiles: {
    [K in VectorSource]: string;
  };
  geoJson: {
    trafficSignUrl: string;
  };
  nls: {
    accessibilityUrl: string;
  };
  rdw: {
    registeredVehicleUrl: string;
    axleUrl: string;
  };
}
