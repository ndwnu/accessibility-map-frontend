import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeNL from '@angular/common/locales/nl';

registerLocaleData(localeNL);

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), provideRouter(routes), { provide: LOCALE_ID, useValue: 'nl' }],
};
