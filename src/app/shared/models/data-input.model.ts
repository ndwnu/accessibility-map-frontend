import { FormControl, FormGroup } from '@angular/forms';
import { VehicleType } from '@modules/map/models';

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

export interface DataInputFormGroup {
  stepOne: FormGroup<StepOneFormGroup>;
  stepTwo: FormGroup<StepTwoFormGroup>;
}
