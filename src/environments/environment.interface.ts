export type EnvironmentType = 'local' | 'staging' | 'production';

export interface Environment {
  production: boolean;
  environmentType: EnvironmentType;
  apiBaseUrl: string;
  baseUrl: string;
  mapStyles: {
    [key: string]: string;
  };
}
