import { Routes } from '@angular/router';
import { MapOverviewComponent } from '@modules/map/pages/map/map-overview.component';

export const routes: Routes = [
  { path: '', component: MapOverviewComponent },
  { path: '**', redirectTo: '' },
];
