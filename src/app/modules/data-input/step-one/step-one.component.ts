import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VEHICLE_TYPES } from '@modules/map/models';
import { CardComponent, FormFieldComponent, InputDirective } from '@ndwnu/design-system';
import { StepOneFormGroup, VehicleInfo } from '@shared/models';
import { RdwService } from '@shared/services';

import { ActionsComponent } from '../actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, startWith } from 'rxjs';

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
  licensePlateError = false;
  vehicleTypes = Object.entries(VEHICLE_TYPES).map(([key, value]) => ({ key, value }));

  vehicleHeight = computed(() => this.form().controls.height.value || 0);
  private rdwService = inject(RdwService);

  ngOnInit() {
    this.licensePlateUnknown = this.form().controls.unknownLicensePlate.value || false;
  }

  isValidLicensePlate(vehicleInfo: VehicleInfo | null): boolean {
    if (vehicleInfo) {
      this.vehicleInfo.emit(vehicleInfo);
    }

    this.licensePlateError = !vehicleInfo;
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

        this.next.emit();
      });
  }

  toggleLicensePlateUnknown() {
    this.licensePlateUnknown = !this.licensePlateUnknown;
    this.form().get('vehicleType')?.reset();
  }
}
