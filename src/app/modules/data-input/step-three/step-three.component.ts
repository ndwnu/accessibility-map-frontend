import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import {
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent,
  DropdownComponent,
  FormFieldComponent,
  IconComponent,
  InputDirective,
  ListItemComponent,
} from '@ndwnu/design-system';
import { FeedbackHeaderComponent } from '@shared/components/feedback-header';
import { StepThreeFormGroup, VehicleInfo } from '@shared/models';
import { RdwService } from '@shared/services';
import { ActionsComponent } from '../actions';
import { defaultMaxCombinedWeight, maxDummyVehicleTotalWeight } from '@modules/data-input';
import { EmissionClass } from '@shared/models/emission-class.model';
import { FuelType } from '@shared/models/fuel-type.model';
import { EmissionClassPipe } from '@shared/pipes/emission-class.pipe';
import { FuelTypePipe } from '@shared/pipes/fuel-type.pipe';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ber-step-three',
  imports: [
    ActionsComponent,
    CardComponent,
    CardContentComponent,
    CardFooterComponent,
    CardHeaderComponent,
    DropdownComponent,
    EmissionClassPipe,
    FeedbackHeaderComponent,
    FuelTypePipe,
    FormFieldComponent,
    IconComponent,
    InputDirective,
    ListItemComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss',
})
export class StepThreeComponent implements OnInit {
  form = input.required<FormGroup<StepThreeFormGroup>>();
  vehicleInfo = input<VehicleInfo>();
  loading = input(false);

  complete = output<void>();
  previous = output<void>();

  maxLoad = computed(() => {
    if (!this.licensePlate) {
      return maxDummyVehicleTotalWeight;
    }

    const vehicleWeight = this.vehicleInfo()?.weight ?? 0;
    const maxWeight = this.vehicleTrailerControl.value
      ? (this.vehicleInfo()?.combinedMaxWeight ?? defaultMaxCombinedWeight)
      : (this.vehicleInfo()?.maxWeight ?? 0);
    return maxWeight - vehicleWeight;
  });

  private dataInputService = inject(DataInputService);
  private rdwService = inject(RdwService);

  emissionClassOptions = Object.values(EmissionClass);
  fuelTypeOptions = Object.values(FuelType);

  selectedFuelTypes = toSignal(this.vehicleFuelTypesControl.valueChanges, {
    initialValue: this.vehicleFuelTypesControl.value,
  });

  selectedFuelTypesCount = computed(() => {
    const selected = this.selectedFuelTypes() ?? [];
    return selected.filter((value) => value !== null).length;
  });

  onFuelTypeToggle(fuelType: FuelType) {
    const formArray = this.vehicleFuelTypesControl;
    const currentValues = formArray.value;
    const isSelected = currentValues.includes(fuelType);

    if (isSelected) {
      const indexToRemove = formArray.controls.findIndex((control) => control.value === fuelType);
      if (indexToRemove !== -1) {
        formArray.removeAt(indexToRemove);
      }
    } else {
      formArray.push(new FormControl(fuelType, { nonNullable: true }));
    }
  }

  isFuelTypeSelected(fuelType: FuelType): boolean {
    const selected = this.selectedFuelTypes() ?? [];
    return selected.filter((value) => value !== null).includes(fuelType);
  }

  get vehicleFuelTypesControl() {
    return this.dataInputService.vehicleFuelTypesControl;
  }

  ngOnInit() {
    this.vehicleLoadControl.valueChanges.subscribe(() => {
      this.updateTotalWeight();
    });
    this.curbWeightControl.valueChanges.subscribe(() => {
      this.updateTotalWeight();
    });
  }

  updateTotalWeight() {
    this.vehicleTotalWeightControl.patchValue(
      (this.vehicleLoadControl.value ?? 0) + (this.curbWeightControl.value ?? 0),
    );
  }

  onComplete() {
    this.complete.emit();
  }

  onPrevious() {
    this.previous.emit();
  }

  get licensePlate() {
    return this.dataInputService.licensePlate;
  }

  get curbWeightControl() {
    return this.dataInputService.vehicleCurbWeightControl;
  }

  get vehicleTotalWeightControl() {
    return this.dataInputService.vehicleTotalWeightControl;
  }

  get vehicleLoadControl() {
    return this.dataInputService.vehicleLoadControl;
  }

  get vehicleAxleLoadControl() {
    return this.dataInputService.vehicleAxleLoadControl;
  }

  get vehicleLengthControl() {
    return this.dataInputService.vehicleLengthControl;
  }

  get vehicleTrailerControl() {
    return this.dataInputService.trailerControl;
  }

  get vehicleWidthControl() {
    return this.dataInputService.vehicleWidthControl;
  }

  rdwLink() {
    return this.rdwService.getPlateCheckUrl(this.licensePlate);
  }
  protected readonly maxDummyVehicleTotalWeight = maxDummyVehicleTotalWeight;
}
