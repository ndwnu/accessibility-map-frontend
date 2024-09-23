import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent,
  FormFieldComponent,
  IconComponent,
  InputDirective,
} from '@ndwnu/design-system';
import { StepThreeFormGroup, VehicleInfo } from '@shared/models';

import { ActionsComponent } from '../actions';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { RdwService } from '@shared/services';

@Component({
  selector: 'ber-step-three',
  standalone: true,
  imports: [
    ActionsComponent,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    CardFooterComponent,
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    InputDirective,
    IconComponent,
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
    const weight = (this.vehicleInfo()?.maxWeight ?? 0) - (this.vehicleInfo()?.weight ?? 0);
    const trailerWeight = this.vehicleInfo()?.trailerWeight ?? 0;
    return this.vehicleTrailerControl.value ? weight + trailerWeight : weight;
  });

  private dataInputService = inject(DataInputService);
  private rdwService = inject(RdwService);

  ngOnInit() {
    this.vehicleLoadControl.valueChanges.subscribe((value) => {
      this.vehicleTotalWeightControl.patchValue((value ?? 0) + (this.vehicleInfo()?.weight ?? 0));
    });
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
}
