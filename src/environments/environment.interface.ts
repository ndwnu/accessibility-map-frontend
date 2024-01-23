import { VectorSource } from '@shared/constants/map.constants';

export type EnvironmentType = 'local' | 'staging' | 'production';

export interface Environment {
  production: boolean;
  environmentType: EnvironmentType;
  apiBaseUrl: string;
  baseUrl: string;
  mapStyles: {
    [key: string]: string;
  };
  vectorTiles: {
    [K in VectorSource]: string;
  };
  accessibilityUrl: string;
}
