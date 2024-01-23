import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MainMapComponent } from '@modules/map/components/main-map/main-map.component';
import { MapFormComponent } from '@modules/map/components/map-form/map-form.component';
import { FormService } from '@modules/map/services/form.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AccessibilityDataService } from '@shared/services/accessibility-data.service';
import { MapExpressionService } from '@shared/services/map-expression.service';
import { MapLayerService } from '@shared/services/map-layer.service';
import { MunicipalityService } from '@shared/services/municipality.service';
import { convertMunicipalityToNLS } from '@shared/utils/convert-municipality-id';

import { FilterSpecification } from 'maplibre-gl';
import { map } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ber-map',
  standalone: true,
  imports: [CommonModule, MainMapComponent, MapFormComponent, HttpClientModule],
  templateUrl: './map.component.html',
  providers: [MapExpressionService, MapLayerService, AccessibilityDataService, FormService, MunicipalityService],
})
export class MapComponent {
  private readonly _accessibilityDataService = inject(AccessibilityDataService);
  private readonly _expressions = inject(MapExpressionService);
  private readonly _formService = inject(FormService);
  private readonly _mapLayerService = inject(MapLayerService);
  private readonly _municiaplityService = inject(MunicipalityService);
  private readonly _offcanvasService = inject(NgbOffcanvas);

  @ViewChild('map') mapComponent: MainMapComponent | undefined;
  loading = signal(false);
  expressions: FilterSpecification | undefined = undefined;

  form = this._formService.createMapForm();

  get vehicleWeightRequired$() {
    return this.form.controls.vehicleType.valueChanges.pipe(map((vehicleType) => vehicleType === 'commercial_vehicle'));
  }
  vehicleWeightRequired = toSignal(this.vehicleWeightRequired$);

  municipalities$ = this._municiaplityService.getMunciaplityFeatures().pipe(map((response) => response.features));
  municipalities = toSignal(this.municipalities$, { initialValue: [] });

  open(content: TemplateRef<any>) {
    this._offcanvasService.open(content, { ariaLabelledBy: 'Gemeente selectie en voertuigdetails formulier' });
  }

  formSubmitted() {
    this.loading.set(true);
    this._accessibilityDataService
      .getInaccessibleRoadSections(this.form.getRawValue())
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response) => {
          const { roadOperatorType, roadOperatorCode } = convertMunicipalityToNLS(this.form.value.municipalityId);
          this.expressions = this._expressions.getRoadsForRoadAuthorityExpressions(
            roadOperatorType,
            roadOperatorCode.toString(),
          );
          this._mapLayerService.showInaccesibleRoadSections(this.mapComponent?.map!, response.inaccessibleRoadSections);
          this.zoomToMunicipality();
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.loading.set(false);
          this._offcanvasService.dismiss();
        },
      });
  }

  private zoomToMunicipality() {
    const municipalityPoint = this.municipalities().find(
      (municipality) => municipality.id === this.form.value.municipalityId,
    )?.geometry;
    if (municipalityPoint && municipalityPoint.coordinates.length >= 2) {
      const [longitude, latitude] = municipalityPoint.coordinates;
      this.mapComponent?.map?.flyTo({ center: [longitude, latitude] as [number, number], zoom: 14 });
    } else {
      console.log('No municipality point found');
    }
  }
}
