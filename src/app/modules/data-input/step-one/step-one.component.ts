import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VEHICLE_TYPES, VehicleType } from '@modules/map/models';
import {
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CheckboxComponent,
  FormFieldComponent,
} from '@ndwnu/design-system';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StepOneFormGroup, VehicleInfo } from '@shared/models';
import { RdwService } from '@shared/services';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { NlsVehicleType } from '@modules/map/models/nlsMappings';
import { ActionsComponent } from '../actions';

@UntilDestroy()
@Component({
  selector: 'ber-step-one',
  standalone: true,
  imports: [
    ActionsComponent,
    CardComponent,
    CardContentComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CheckboxComponent,
    CommonModule,
    FormFieldComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepOneComponent implements OnInit {
  form = input.required<FormGroup<StepOneFormGroup>>();

  private readonly destroyRef = inject(DestroyRef);

  next = output<void>();
  vehicleInfo = output<VehicleInfo>();

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

  private readonly dataInputService = inject(DataInputService);
  private readonly rdwService = inject(RdwService);

  get licensePlateControl() {
    return this.dataInputService.licensePlateControl;
  }

  get licensePlate() {
    return this.dataInputService.licensePlate;
  }

  get unknownLicensePlateControl() {
    return this.dataInputService.unknownLicensePlateControl;
  }

  get unknownLicensePlate() {
    return this.dataInputService.unknownLicensePlate;
  }

  get vehicleTypeControl() {
    return this.dataInputService.vehicleTypeControl;
  }

  get heightControl() {
    return this.dataInputService.heightControl;
  }

  ngOnInit() {
    if (environment.mock) {
      const mockWithLicensePlate = true; // Change this to test with or without a license plate.
      const mockLicensePlate = 'ZT-095-J';
      const mockVehicle = NlsVehicleType.Car;

      this.unknownLicensePlateControl.setValue(true);
      this.vehicleTypeControl.setValue(mockVehicle);
      if (mockWithLicensePlate) {
        this.unknownLicensePlateControl.setValue(false);
        this.licensePlateControl.setValue(mockLicensePlate);
      }
    }

    this.heightControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
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
    if (this.unknownLicensePlate) {
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
    this.unknownLicensePlateControl.setValue(!this.unknownLicensePlate);
    this.vehicleTypeControl.reset();

    if (this.unknownLicensePlate) {
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
