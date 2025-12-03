import { Component, signal, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { MainMapComponent } from '@modules/map/components/main-map/main-map.component';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FilterSpecification } from 'maplibre-gl';
import { UserVehicleSummaryComponent } from '@modules/map/components/user-vehicle/summary/user-vehicle-summary.component';
import { UserVehicleFormComponent } from '@modules/map/components/user-vehicle/form/user-vehicle-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CardHeaderComponent, CardComponent, CardContentComponent, IconComponent } from '@ndwnu/design-system';

@UntilDestroy()
@Component({
  selector: 'ber-map',
  imports: [
    MainMapComponent,
    UserVehicleFormComponent,
    UserVehicleSummaryComponent,
    ReactiveFormsModule,
    CardHeaderComponent,
    CardComponent,
    CardContentComponent,
    IconComponent,
  ],
  templateUrl: './map-overview.component.html',
  styleUrl: './map-overview.component.scss',
})
export class MapOverviewComponent {
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private overlayRef?: OverlayRef;

  showControlPanel = signal<boolean>(false);
  expressions: FilterSpecification | undefined = undefined;

  open(templateRef: TemplateRef<any>) {
    if (this.overlayRef) {
      return; // Already open
    }

    const positionStrategy = this.overlay.position().global().right('0').top('0');

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });

    const portal = new TemplatePortal(templateRef, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
    this.showControlPanel.set(true);
  }
}
