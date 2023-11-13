import { Routes } from '@angular/router';
import { MapComponent } from './modules/map/pages/map/map.component';

export const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'map', component: MapComponent },
];
