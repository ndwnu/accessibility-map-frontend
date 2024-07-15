import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VEHICLE_TYPES, VehicleType } from '@modules/map/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CardComponent, CheckboxComponent, FormFieldComponent } from '@ndwnu/design-system';
import { StepOneFormGroup, VehicleInfo } from '@shared/models';
import { RdwService } from '@shared/services';

import { ActionsComponent } from '../actions';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { NlsVehicleType } from '@modules/map/models/nlsMappings';

@UntilDestroy()
@Component({
  selector: 'ber-step-one',
  standalone: true,
  imports: [ActionsComponent, CardComponent, CheckboxComponent, CommonModule, FormFieldComponent, ReactiveFormsModule],
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepOneComponent implements OnInit {
  form = input.required<FormGroup<StepOneFormGroup>>();

  next = output<void>();
  vehicleInfo = output<VehicleInfo>();

  licensePlateUnknown = false;
  licensePlateNotFound = signal(false);
  licensePlateTractor = signal(false);
  licensePlateError = computed<string | undefined>(() => {
    if (this.licensePlateNotFound()) {
      return 'Kenteken niet gevonden';
    }
    if (this.licensePlateTractor()) {
      return 'Kenteken van een landbouwvoertuig, je kunt helaas geen voertuigen van dit type invoeren in de Bereikbaarheidskaart.';
    }
    return undefined;
  });

  vehicleTypes = Object.entries(VEHICLE_TYPES)
    .filter(([key]) => (key as VehicleType) !== NlsVehicleType.Tractor)
    .map(([key, value]) => ({ key, value }));

  vehicleHeight = computed(() => this.form().controls.height.value || 0);
  vehicleHeightError = signal<string | undefined>(undefined);

  private dataInputService = inject(DataInputService);
  private rdwService = inject(RdwService);

  get vehicleTypeControl() {
    return this.dataInputService.vehicleTypeControl;
  }

  ngOnInit() {
    this.licensePlateUnknown = this.form().controls.unknownLicensePlate.value || false;
    this.form().controls.height.valueChanges.subscribe(() => {
      this.updateVehicleHeightError();
    });
  }

  isValidLicensePlate(vehicleInfo: VehicleInfo | null): boolean {
    if (vehicleInfo) {
      this.vehicleInfo.emit(vehicleInfo);
    }

    this.licensePlateNotFound.set(!vehicleInfo);
    return !!vehicleInfo;
  }

  onNext() {
    if (this.licensePlateUnknown) {
      this.next.emit();
      return;
    }

    const licensePlate = this.form().controls['licensePlate'].value;
    if (!licensePlate) {
      return;
    }

    this.rdwService
      .getVehicleInfo(licensePlate)
      .pipe(untilDestroyed(this))
      .subscribe((vehicleInfo) => {
        if (!this.isValidLicensePlate(vehicleInfo)) {
          return;
        }
        if (vehicleInfo?.type === NlsVehicleType.Tractor) {
          this.licensePlateTractor.set(true);
          return;
        }

        this.next.emit();
      });
  }

  toggleLicensePlateUnknown() {
    this.licensePlateUnknown = !this.licensePlateUnknown;
    this.vehicleTypeControl.reset();

    if (this.licensePlateUnknown) {
      this.vehicleTypeControl.setValidators(Validators.required);
    } else {
      this.vehicleTypeControl.clearValidators();
    }

    this.vehicleTypeControl.reset();
    this.vehicleTypeControl.updateValueAndValidity();
  }

  private updateVehicleHeightError() {
    const errors = this.form().controls.height.errors;
    if (errors?.min || errors?.max) {
      this.vehicleHeightError.set('De hoogte mag niet meer zijn dan 4 meter');
    } else {
      this.vehicleHeightError.set(undefined);
    }
  }
}
