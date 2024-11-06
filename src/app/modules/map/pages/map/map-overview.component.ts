import { CommonModule } from '@angular/common';
import { Component, inject, signal, TemplateRef } from '@angular/core';
import { MainMapComponent } from '@modules/map/components/main-map/main-map.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FilterSpecification } from 'maplibre-gl';
import { CardComponent } from '@ndwnu/design-system';
import { UserVehicleSummaryComponent } from '@modules/map/components/user-vehicle/summary/user-vehicle-summary.component';
import { UserVehicleFormComponent } from '@modules/map/components/user-vehicle/form/user-vehicle-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlPanelComponent } from '../../components/control-panel/control-panel.component';

@UntilDestroy()
@Component({
  selector: 'ber-map',
  standalone: true,
  imports: [
    CardComponent,
    MainMapComponent,
    UserVehicleFormComponent,
    UserVehicleSummaryComponent,
    ReactiveFormsModule,
    ControlPanelComponent,
  ],
  templateUrl: './map-overview.component.html',
  styleUrl: './map-overview.component.scss',
})
export class MapOverviewComponent {
  private readonly offcanvasService = inject(NgbOffcanvas);

  showControlPanel = signal<boolean>(false);
  expressions: FilterSpecification | undefined = undefined;

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {
      ariaLabelledBy: 'Gemeente selectie en voertuigdetails formulier',
      position: 'end',
    });
  }

  close() {
    this.offcanvasService.dismiss('Cross click');
    this.showControlPanel.set(true);
  }
}
