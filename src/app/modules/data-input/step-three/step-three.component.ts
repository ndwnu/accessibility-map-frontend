import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import {
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent,
  FormFieldComponent,
  IconComponent,
  InputDirective,
} from '@ndwnu/design-system';
import { FeedbackHeaderComponent } from '@shared/components/feedback-header';
import { StepThreeFormGroup, VehicleInfo } from '@shared/models';
import { RdwService } from '@shared/services';
import { ActionsComponent } from '../actions';
import { maxDummyVehicleTotalWeight } from '@modules/data-input';

@Component({
  selector: 'ber-step-three',
  standalone: true,
  imports: [
    ActionsComponent,
    CardComponent,
    CardContentComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CommonModule,
    FeedbackHeaderComponent,
    FormFieldComponent,
    IconComponent,
    InputDirective,
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
    const weight = (this.vehicleInfo()?.maxWeight ?? 0) - (this.vehicleInfo()?.weight ?? 0);
    const trailerWeight = this.vehicleInfo()?.trailerWeight ?? 0;
    return this.vehicleTrailerControl.value ? weight + trailerWeight : weight;
  });

  private dataInputService = inject(DataInputService);
  private rdwService = inject(RdwService);

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
