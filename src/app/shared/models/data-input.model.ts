import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { VehicleType } from '@modules/map/models';
import { EmissionClass } from '@shared/models/emission-class.model';
import { FuelType } from '@shared/models/fuel-type.model';

export interface StepOneFormGroup {
  licensePlate: FormControl<string | null>;
  unknownLicensePlate: FormControl<boolean | null>;
  vehicleType: FormControl<VehicleType | null>;
  height: FormControl<number | null>;
  trailer: FormControl<boolean | null>;
}

export interface StepTwoFormGroup {
  municipalityId: FormControl<string | null>;
}

export interface StepThreeFormGroup {
  vehicleCurbWeight: FormControl<number | null>;
  vehicleLoad: FormControl<number | null>;
  vehicleTotalWeight: FormControl<number | null>;
  vehicleAxleLoad: FormControl<number | null>;
  vehicleLength: FormControl<number | null>;
  vehicleWidth: FormControl<number | null>;
  vehicleEmissionClass: FormControl<EmissionClass | null>;
  vehicleFuelTypes: FormArray<FormControl<FuelType>>;
}

export interface DataInputFormGroup {
  stepOne: FormGroup<StepOneFormGroup>;
  stepTwo: FormGroup<StepTwoFormGroup>;
  stepThree: FormGroup<StepThreeFormGroup>;
}
