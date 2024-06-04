import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardComponent, FormFieldComponent, InputDirective } from '@ndwnu/design-system';
import { StepOneFormGroup, VehicleInfo, exampleVehicleInfoList } from '@shared/models';
import { RdwService } from '@shared/services';

import { ActionsComponent } from '../actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { VEHICLE_TYPES, VehicleType } from '@modules/map/models';

@UntilDestroy()
@Component({
  selector: 'ber-step-one',
  standalone: true,
  imports: [ActionsComponent, CardComponent, CommonModule, FormFieldComponent, InputDirective, ReactiveFormsModule],
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
    .filter(([key]) => (key as VehicleType) !== 'tractor')
    .map(([key, value]) => ({ key, value }));

  vehicleHeight = computed(() => this.form().controls.height.value || 0);
  private rdwService = inject(RdwService);

  ngOnInit() {
    this.licensePlateUnknown = this.form().controls.unknownLicensePlate.value || false;
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
        if (vehicleInfo?.type === 'tractor') {
          this.licensePlateTractor.set(true);
          return;
        }

        this.next.emit();
      });
  }

  toggleLicensePlateUnknown() {
    this.licensePlateUnknown = !this.licensePlateUnknown;
    this.form().get('vehicleType')?.reset();
  }
}
