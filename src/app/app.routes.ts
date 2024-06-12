import { Routes } from '@angular/router';
import { MapOverviewComponent } from '@modules/map/pages/map/map-overview.component';

export const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'map', component: MapOverviewComponent },
];
