import { Injectable, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DataInputFormGroup, StepOneFormGroup, StepThreeFormGroup, StepTwoFormGroup } from '@shared/models';
import { VEHICLE_TYPES } from '@modules/map/models';

@Injectable({
  providedIn: 'root',
})
export class DataInputService {
  activeStep = signal(0);
  form: FormGroup<DataInputFormGroup>;

  constructor() {
    this.form = this.createForm();
  }

  get stepOneForm(): FormGroup<StepOneFormGroup> {
    return this.form.get('stepOne') as FormGroup<StepOneFormGroup>;
  }

  get stepTwoForm(): FormGroup<StepTwoFormGroup> {
    return this.form.get('stepTwo') as FormGroup<StepTwoFormGroup>;
  }

  get stepThreeForm(): FormGroup<StepThreeFormGroup> {
    return this.form.get('stepThree') as FormGroup<StepThreeFormGroup>;
  }

  // StepOneForm

  get licensePlateControl() {
    return this.stepOneForm.get('licensePlate')!;
  }

  get licensePlate() {
    return this.licensePlateControl?.value?.toLocaleUpperCase() ?? '';
  }

  get vehicleTypeControl() {
    return this.stepOneForm.get('vehicleType')!;
  }

  get vehicleType() {
    return this.vehicleTypeControl?.value ? VEHICLE_TYPES[this.vehicleTypeControl?.value] : '';
  }

  get heightControl() {
    return this.stepOneForm.get('height')!;
  }

  get height() {
    return this.heightControl?.value ?? 0;
  }

  get trailerControl() {
    return this.stepOneForm.get('trailer')!;
  }

  get trailer() {
    return this.trailerControl?.value ?? false;
  }

  // StepTwoForm

  get municipalityIdControl() {
    return this.stepTwoForm.get('municipalityId')!;
  }

  get municipalityId() {
    return this.municipalityIdControl?.value ?? '';
  }

  get addressControl() {
    return this.stepTwoForm.get('address')!;
  }

  get address() {
    return this.addressControl?.value ?? '';
  }

  get pdokIdControl() {
    return this.stepTwoForm.get('pdokId')!;
  }

  get pdokId() {
    return this.pdokIdControl?.value ?? '';
  }

  get pdokDataControl() {
    return this.stepTwoForm.get('pdokData')!;
  }

  get pdokData() {
    return this.pdokDataControl?.value;
  }

  // StepThreeForm

  get vehicleCurbWeightControl() {
    return this.stepThreeForm.get('vehicleCurbWeight')!;
  }

  get vehicleCurbWeight() {
    return this.vehicleCurbWeightControl?.value ?? 0;
  }

  get vehicleLoadControl() {
    return this.stepThreeForm.get('vehicleLoad')!;
  }

  get vehicleLoad() {
    return this.vehicleLoadControl?.value ?? 0;
  }

  get vehicleTotalWeightControl() {
    return this.stepThreeForm.get('vehicleTotalWeight')!;
  }

  get vehicleTotalWeight() {
    return this.vehicleTotalWeightControl?.value ?? 0;
  }

  get vehicleAxleLoadControl() {
    return this.stepThreeForm.get('vehicleAxleLoad')!;
  }

  get vehicleAxleLoad() {
    return this.vehicleAxleLoadControl?.value ?? 0;
  }

  get vehicleLengthControl() {
    return this.stepThreeForm.get('vehicleLength')!;
  }

  get vehicleLength() {
    return this.vehicleLengthControl?.value ?? 0;
  }

  get vehicleWidthControl() {
    return this.stepThreeForm.get('vehicleWidth')!;
  }

  get vehicleWidth() {
    return this.vehicleWidthControl?.value ?? 0;
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
        pdokId: new FormControl(null, Validators.required),
        municipalityId: new FormControl(null, Validators.required),
        address: new FormControl(null, Validators.required),
        pdokData: new FormControl(null),
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
