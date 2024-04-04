import { FormControl, FormGroup } from '@angular/forms';
import { VehicleType } from '@modules/map/models';

export interface DataInputFormGroup {
  stepOne: FormGroup<StepOneFormGroup>;
}

export interface StepOneFormGroup {
  licensePlate: FormControl<string | null>;
  unknownLicensePlate: FormControl<boolean | null>;
  vehicleType: FormControl<VehicleType | null>;
  height: FormControl<number | null>;
  trailer: FormControl<boolean | null>;
}
