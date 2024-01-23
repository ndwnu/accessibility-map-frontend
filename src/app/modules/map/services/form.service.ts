import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VehicleType } from '@modules/map/models';

@Injectable()
export class FormService {
  createMapForm() {
    return new FormGroup({
      municipalityId: new FormControl<string>('GM0344', { validators: [Validators.required], nonNullable: true }),
      vehicleType: new FormControl<VehicleType>('car', { validators: [Validators.required], nonNullable: true }),
      vehicleLength: new FormControl<number | undefined>(undefined, {
        validators: [Validators.min(0), Validators.max(22)],
        nonNullable: true,
      }),
      vehicleWidth: new FormControl<number | undefined>(undefined, {
        validators: [Validators.min(0), Validators.max(3)],
        nonNullable: true,
      }),
      vehicleHeight: new FormControl<number | undefined>(undefined, {
        validators: [Validators.min(0), Validators.max(4)],
        nonNullable: true,
      }),
      vehicleWeight: new FormControl<number | undefined>(undefined, {
        validators: [Validators.min(1), Validators.max(60)],
        nonNullable: true,
      }),
      vehicleAxleWeight: new FormControl<number | undefined>(undefined, {
        validators: [Validators.min(0), Validators.max(12)],
        nonNullable: true,
      }),
      vehicleHasTrailer: new FormControl<boolean>(false, { nonNullable: true }),
    });
  }
}
