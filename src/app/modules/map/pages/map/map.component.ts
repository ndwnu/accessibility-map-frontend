import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, computed, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MainMapComponent } from '@modules/map/components/main-map/main-map.component';
import { MapFormComponent } from '@modules/map/components/map-form/map-form.component';
import { FormService } from '@modules/map/services/form.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AccessibilityDataService } from '@shared/services/accessibility-data.service';
import { MapLayerService } from '@shared/services/map-layer.service';
import { MunicipalityService } from '@shared/services/municipality.service';

import { FilterSpecification } from 'maplibre-gl';
import { map, tap } from 'rxjs';
import { RdwService } from '@shared/services/rdw.service';
import { ReactiveFormsModule } from '@angular/forms';
import { VehicleInfo } from '@shared/models/vehicle-info.model';
import { AccessibilityFilter } from '@shared/models';
import { CardComponent } from '@noway/ndw';

const MIN_LICENSE_PLATE_LENGTH = 5;

@UntilDestroy()
@Component({
  selector: 'ber-map',
  standalone: true,
  imports: [CardComponent, CommonModule, HttpClientModule, MainMapComponent, MapFormComponent, ReactiveFormsModule],
  templateUrl: './map.component.html',
  providers: [MapLayerService, AccessibilityDataService, FormService, MunicipalityService, RdwService],
  styleUrl: './map.component.scss',
})
export class MapComponent {
  private readonly _accessibilityDataService = inject(AccessibilityDataService);
  private readonly _formService = inject(FormService);
  private readonly _mapLayerService = inject(MapLayerService);
  private readonly _municipalityService = inject(MunicipalityService);
  private readonly _offcanvasService = inject(NgbOffcanvas);
  private readonly _rdwService = inject(RdwService);

  @ViewChild('map') mapComponent: MainMapComponent | undefined;
  @ViewChild('content') mapForm?: TemplateRef<any>;

  loading = signal(false);
  expressions: FilterSpecification | undefined = undefined;

  form = this._formService.createMapForm();

  get vehicleLoadRequired$() {
    return this.form.controls.vehicleType.valueChanges.pipe(
      map((vehicleType) => vehicleType === 'commercial_vehicle_van'),
      tap((required) =>
        required
          ? this._formService.setValidationRules(this.form, {
              minValues: {},
              maxValues: {},
              required: { vehicleWeight: true, vehicleLoad: true },
            })
          : this._formService.setValidationRules(this.form, { minValues: {}, maxValues: {}, required: {} }),
      ),
    );
  }
  vehicleLoadRequired = toSignal(this.vehicleLoadRequired$);

  vehicleInfoFromRdwSignal = signal(null as VehicleInfo | null);

  maxVehicleAxleWeight = computed(() => this.vehicleInfoFromRdwSignal()?.maxAxleWeight);
  maxVehicleLoad = computed(() =>
    this.vehicleInfoFromRdwSignal()
      ? parseFloat(
          (
            (this.vehicleInfoFromRdwSignal()?.maxWeight || 0) - (this.vehicleInfoFromRdwSignal()?.emptyWeight || 0)
          ).toFixed(3),
        )
      : undefined,
  );

  municipalities$ = this._municipalityService
    .getMunicipalityFeatures()
    .pipe(
      map((response) => [...response.features].sort((a, b) => a.properties?.name?.localeCompare(b.properties?.name))),
    );
  municipalities = toSignal(this.municipalities$, { initialValue: [] });

  open(content: TemplateRef<any>) {
    this._offcanvasService.open(content, {
      ariaLabelledBy: 'Gemeente selectie en voertuigdetails formulier',
      position: 'end',
    });
  }

  fetchVehicleInfo() {
    const { licensePlate } = this.form.getRawValue();
    if (licensePlate && licensePlate.length >= MIN_LICENSE_PLATE_LENGTH) {
      this._rdwService
        .getVehicleInfo(licensePlate)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (vehicleInfo) => {
            if (vehicleInfo) {
              this.fillFormFromVehicleInfo(vehicleInfo);
              this.vehicleInfoFromRdwSignal.set(vehicleInfo);
            } else {
              this.setLicensePlateError('Ophalen bij RDW is mislukt');
            }
          },
          error: () => this.setLicensePlateError('Ophalen bij RDW is mislukt'),
        });
    } else {
      this.setLicensePlateError('Ongeldig kenteken');
    }
  }

  private setLicensePlateError(customMessage: string) {
    this.form.get('licensePlate')?.setErrors({ rdwError: { customMessage } });
  }

  private fillFormFromVehicleInfo(vehicleInfo: VehicleInfo) {
    const vehicleLoad = parseFloat((vehicleInfo.maxWeight - vehicleInfo.emptyWeight).toFixed(3));
    this.form.patchValue({
      vehicleType: vehicleInfo.type,
      vehicleLength: vehicleInfo.length,
      vehicleWidth: vehicleInfo.width,
      vehicleHeight: vehicleInfo.height,
      vehicleWeight: vehicleInfo.weight,
      vehicleLoad,
      vehicleAxleWeight: vehicleInfo.maxAxleWeight,
    });
    this._formService.setValidationRules(this.form, {
      minValues: {
        vehicleLength: vehicleInfo.length,
        vehicleWidth: vehicleInfo.width,
        vehicleWeight: vehicleInfo.weight,
        vehicleLoad: 0,
      },
      maxValues: {
        vehicleLoad,
        vehicleAxleWeight: vehicleInfo.maxAxleWeight,
      },
      required: {
        vehicleLoad: this.vehicleLoadRequired() || false,
        vehicleWeight: this.vehicleLoadRequired() || false,
      },
    });
    this.form.controls.vehicleWeight.disable();
  }

  formClear() {
    this.form.reset();
    this._formService.setValidationRules(this.form, { minValues: {}, maxValues: {}, required: {} });
    this.vehicleInfoFromRdwSignal.set(null);
    this.form.controls.vehicleWeight.enable();
  }

  formSubmitted() {
    this.loading.set(true);
    this._accessibilityDataService
      .getInaccessibleRoadSections(this.mapFormToFilterCriteria(this.form.getRawValue()))
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response) => {
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

  private mapFormToFilterCriteria(formValue: any): AccessibilityFilter {
    return {
      ...formValue,
      vehicleLoad: undefined,
      vehicleWeight: formValue.vehicleWeight + formValue.vehicleLoad,
    } as AccessibilityFilter;
  }

  private zoomToMunicipality() {
    const municipalityPoint = this.municipalities().find(
      (municipality) => municipality.id === this.form.value.municipalityId,
    )?.geometry;
    if (municipalityPoint && municipalityPoint.coordinates.length >= 2) {
      const [longitude, latitude] = municipalityPoint.coordinates;
      this.mapComponent?.map?.flyTo({ center: [longitude, latitude] as [number, number], zoom: 12 });
    } else {
      console.log('No municipality point found');
    }
  }
}
