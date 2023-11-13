import { Environment } from '@env/environment.interface';

declare global {
  interface Window {
    environment: Partial<Environment>;
  }
}
