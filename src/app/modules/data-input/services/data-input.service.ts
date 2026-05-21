/* eslint-disable max-lines */
import { Injectable, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  defaultMaxCombinedWeight,
  maxDummyAxleWeight,
  maxDummyVehicleTotalWeight,
} from '@modules/data-input/constants';
import { VEHICLE_TYPES } from '@modules/map/models';
import {
  DataInputFormGroup,
  StepOneFormGroup,
  StepThreeFormGroup,
  StepTwoFormGroup,
  VehicleInfo,
} from '@shared/models';
import { FuelType } from '@shared/models/fuel-type.model';

@Injectable({
  providedIn: 'root',
})
export class DataInputService {
  form: FormGroup<DataInputFormGroup>;
  vehicleInfo = signal<VehicleInfo | undefined>(undefined);

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

  get unknownLicensePlateControl() {
    return this.stepOneForm.get('unknownLicensePlate')!;
  }

  get unknownLicensePlate() {
    return this.unknownLicensePlateControl?.value ?? false;
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

  get vehicleEmissionClassControl() {
    return this.stepThreeForm.get('vehicleEmissionClass')!;
  }

  get vehicleEmissionClass() {
    return this.vehicleEmissionClassControl?.value;
  }

  get vehicleFuelTypesControl() {
    return this.stepThreeForm.get('vehicleFuelTypes')! as FormArray<FormControl<FuelType>>;
  }

  get vehicleFuelTypes() {
    return this.vehicleFuelTypesControl?.value;
  }

  resetForm() {
    this.form.reset();
  }

  markFormAsPristine() {
    this.form.markAsPristine();
  }

  setVehicleInfo(vehicleInfo: VehicleInfo) {
    this.vehicleTypeControl.setValue(vehicleInfo.type, { emitEvent: false });

    const maxWeight = this.trailer
      ? (vehicleInfo.combinedMaxWeight ?? defaultMaxCombinedWeight)
      : vehicleInfo.maxWeight;
    let vehicleLoad = maxWeight && vehicleInfo.weight ? Math.round(maxWeight - vehicleInfo.weight) : 0;
    if (this.trailer) {
      vehicleLoad += vehicleInfo.trailerWeight ?? 0;
    }

    const vehicleAxleLoad = vehicleInfo.maxAxleWeight ?? 0;
    this.stepThreeForm.patchValue({
      vehicleCurbWeight: vehicleInfo.weight,
      vehicleLoad,
      vehicleTotalWeight: this.trailer
        ? (vehicleInfo.combinedMaxWeight ?? defaultMaxCombinedWeight)
        : vehicleInfo.maxWeight,
      vehicleAxleLoad,
      vehicleLength: vehicleInfo.length,
      vehicleWidth: vehicleInfo.width,
      vehicleEmissionClass: vehicleInfo.emissionClass,
    });

    if (vehicleInfo.fuelTypes) {
      this.vehicleFuelTypesControl.clear();
      vehicleInfo.fuelTypes.forEach((fuelType) => {
        this.vehicleFuelTypesControl.push(new FormControl(fuelType, { nonNullable: true }));
      });
    }

    if (this.licensePlate) {
      this.vehicleLoadControl.setValidators([Validators.required, Validators.max(vehicleLoad)]);
      this.vehicleAxleLoadControl.setValidators([Validators.required, Validators.max(vehicleAxleLoad)]);
      this.vehicleInfo.set(vehicleInfo);
    } else {
      this.vehicleLoadControl.setValidators([Validators.required, Validators.max(maxDummyVehicleTotalWeight)]);
      this.vehicleTotalWeightControl.setValidators([Validators.required, Validators.max(maxDummyVehicleTotalWeight)]);
      this.vehicleAxleLoadControl.setValidators([Validators.required, Validators.max(maxDummyAxleWeight)]);
      this.vehicleInfo.set({ ...vehicleInfo, maxAxleWeight: maxDummyAxleWeight });
    }
  }

  private createForm() {
    return new FormGroup<DataInputFormGroup>({
      stepOne: new FormGroup<StepOneFormGroup>(
        {
          licensePlate: new FormControl(null),
          unknownLicensePlate: new FormControl(false),
          vehicleType: new FormControl(null),
          height: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(4)]),
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
        vehicleLength: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(22)]),
        vehicleWidth: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(3)]),
        vehicleEmissionClass: new FormControl(null),
        vehicleFuelTypes: new FormArray<FormControl<FuelType>>([]),
      }),
    });
  }

  private eitherVehicleTypeOrLicensePlate(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const licensePlate = group.get('licensePlate')?.value;
      const vehicleType = group.get('vehicleType')?.value;

      return licensePlate || vehicleType ? null : { eitherVehicleTypeOrLicensePlate: true };
    };
  }
}
