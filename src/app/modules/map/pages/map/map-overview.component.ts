import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, TemplateRef } from '@angular/core';
import { MainMapComponent } from '@modules/map/components/main-map/main-map.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FilterSpecification } from 'maplibre-gl';
import { CardComponent } from '@ndwnu/design-system';
import { UserVehicleSummaryComponent } from '@modules/map/components/user-vehicle/summary/user-vehicle-summary.component';
import { UserVehicleFormComponent } from '@modules/map/components/user-vehicle/form/user-vehicle-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'ber-map',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    HttpClientModule,
    MainMapComponent,
    UserVehicleFormComponent,
    UserVehicleSummaryComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './map-overview.component.html',
  styleUrl: './map-overview.component.scss',
})
export class MapOverviewComponent {
  private readonly offcanvasService = inject(NgbOffcanvas);

  expressions: FilterSpecification | undefined = undefined;

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {
      ariaLabelledBy: 'Gemeente selectie en voertuigdetails formulier',
      position: 'end',
    });
  }
}
