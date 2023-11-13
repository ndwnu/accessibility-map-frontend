import { Environment } from '@env/environment.interface';

export const environment = {
  ...window.environment,
  production: true,
} as Environment;
