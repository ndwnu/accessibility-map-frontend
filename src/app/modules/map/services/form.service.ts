import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VehicleType } from '@modules/map/models';

const DEFAULT_MIN_VALUES: { [controlName: string]: number } = {
  vehicleLength: 0,
  vehicleWidth: 0,
  vehicleHeight: 0,
  vehicleWeight: 1,
  vehicleLoad: 0,
};

const DEFAULT_MAX_VALUES: { [controlName: string]: number } = {
  vehicleWeight: 60,
  vehicleLoad: 60,
  vehicleAxleWeight: 12,
};

@Injectable({
  providedIn: 'root',
})
export class FormService {
  createMapForm() {
    const form = new FormGroup({
      municipalityId: new FormControl<string>('GM0344', { validators: [Validators.required], nonNullable: true }),
      licensePlate: new FormControl<string | undefined>(undefined),
      vehicleType: new FormControl<VehicleType>('car', { validators: [Validators.required], nonNullable: true }),
      vehicleLength: new FormControl<number | undefined>(undefined, {
        validators: [],
        nonNullable: true,
      }),
      vehicleWidth: new FormControl<number | undefined>(undefined, {
        validators: [],
        nonNullable: true,
      }),
      vehicleHeight: new FormControl<number | undefined>(undefined, {
        validators: [],
        nonNullable: true,
      }),
      vehicleWeight: new FormControl<number | undefined>(undefined, {
        validators: [],
        nonNullable: true,
      }),
      vehicleLoad: new FormControl<number | undefined>(undefined, {
        validators: [],
        nonNullable: true,
      }),
      vehicleAxleWeight: new FormControl<number | undefined>(undefined, {
        validators: [],
        nonNullable: true,
      }),
      vehicleHasTrailer: new FormControl<boolean>(false, { nonNullable: true }),
    });

    this.setValidationRules(form, { minValues: DEFAULT_MIN_VALUES, maxValues: DEFAULT_MAX_VALUES, required: {} });
    return form;
  }

  setValidationRules(
    form: FormGroup,
    rules: {
      minValues: { [controlName: string]: number };
      maxValues: { [controlName: string]: number };
      required: { [controlName: string]: boolean };
    },
  ) {
    ['vehicleLength', 'vehicleWidth', 'vehicleHeight', 'vehicleWeight', 'vehicleLoad', 'vehicleAxleWeight'].forEach(
      (controlName) => {
        form.controls[controlName].setValidators(
          this.validatorsForControl(
            rules.minValues[controlName] || DEFAULT_MIN_VALUES[controlName],
            rules.maxValues[controlName] || DEFAULT_MAX_VALUES[controlName],
            rules.required[controlName] || false,
          ),
        );
        form.controls[controlName].updateValueAndValidity();
      },
    );
  }

  private validatorsForControl(minValue: number | undefined, maxValue: number | undefined, required: boolean) {
    return [
      ...(minValue ? [Validators.min(minValue)] : []),
      ...(maxValue ? [Validators.max(maxValue)] : []),
      ...(required ? [Validators.required] : []),
    ];
  }
}
