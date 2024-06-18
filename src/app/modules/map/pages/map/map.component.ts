import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, TemplateRef, viewChild, ViewChild } from '@angular/core';
import { MainMapComponent } from '@modules/map/components/main-map/main-map.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AccessibilityDataService } from '@shared/services/accessibility-data.service';
import { FilterSpecification } from 'maplibre-gl';
import { combineLatest, filter } from 'rxjs';
import { CardComponent } from '@ndwnu/design-system';
import { MapService } from '@shared/services';
import { UserVehicleSummaryComponent } from '@modules/map/components/user-vehicle/summary/user-vehicle-summary.component';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { UserVehicleFormComponent } from '@modules/map/components/user-vehicle/form/user-vehicle-form.component';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DataInputFormGroup, InaccessibleRoadSection } from '@shared/models';

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
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  private readonly offcanvasService = inject(NgbOffcanvas);

  expressions: FilterSpecification | undefined = undefined;

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {
      ariaLabelledBy: 'Gemeente selectie en voertuigdetails formulier',
      position: 'end',
    });
  }
}
