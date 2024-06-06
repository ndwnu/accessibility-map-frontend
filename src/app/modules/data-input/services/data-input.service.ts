import { Injectable, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { DataInputFormGroup, StepOneFormGroup, StepTwoFormGroup, StepThreeFormGroup } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class DataInputService {
  activeStep = signal(0);
  form: FormGroup<DataInputFormGroup>;

  constructor() {
    this.form = this.createForm();
  }

  setActiveStep(step: number) {
    this.activeStep.set(step);
  }

  resetForm() {
    this.form.reset();
  }

  private createForm() {
    return new FormGroup<DataInputFormGroup>({
      stepOne: new FormGroup<StepOneFormGroup>(
        {
          licensePlate: new FormControl(null),
          unknownLicensePlate: new FormControl(false),
          vehicleType: new FormControl(null),
          height: new FormControl(null, [Validators.required, Validators.min(0)]),
          trailer: new FormControl(false),
        },
        [this.eitherVehicleTypeOrLicensePlate()],
      ),
      stepTwo: new FormGroup<StepTwoFormGroup>({
        municipalityId: new FormControl(null, Validators.required),
      }),

      stepThree: new FormGroup<StepThreeFormGroup>({
        vehicleCurbWeight: new FormControl(0),
        vehicleLoad: new FormControl(null, [Validators.required, Validators.min(0)]),
        vehicleTotalWeight: new FormControl(0),
        vehicleAxleLoad: new FormControl(null, [Validators.required, Validators.min(0)]),
        vehicleLength: new FormControl(null, [Validators.required, Validators.min(0)]),
        vehicleWidth: new FormControl(null, [Validators.required, Validators.min(0)]),
      }),
    });
  }

  private eitherVehicleTypeOrLicensePlate(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      let licensePlate = group.get('licensePlate')?.value;
      let vehicleType = group.get('vehicleType')?.value;

      return licensePlate || vehicleType ? null : { eitherVehicleTypeOrLicensePlate: true };
    };
  }
}
