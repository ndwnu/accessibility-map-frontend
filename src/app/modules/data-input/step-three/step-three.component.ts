import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardComponent, FormFieldComponent, InputDirective } from '@ndwnu/design-system';
import { StepThreeFormGroup, VehicleInfo } from '@shared/models';

import { ActionsComponent } from '../actions';
import { DataInputService } from '@modules/data-input/services/data-input.service';

@Component({
  selector: 'ber-step-three',
  standalone: true,
  imports: [ActionsComponent, CardComponent, CommonModule, ReactiveFormsModule, FormFieldComponent, InputDirective],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss',
})
export class StepThreeComponent implements OnInit {
  form = input.required<FormGroup<StepThreeFormGroup>>();
  vehicleInfo = input<VehicleInfo>();

  complete = output<void>();
  previous = output<void>();

  maxLoad = computed(() => (this.vehicleInfo()?.maxWeight ?? 0) - (this.vehicleInfo()?.weight ?? 0));

  private dataInputService = inject(DataInputService);

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

  get vehicleTotalWeightControl() {
    return this.dataInputService.vehicleTotalWeightControl;
  }

  get vehicleLoadControl() {
    return this.dataInputService.vehicleLoadControl;
  }

  get vehicleAxleLoadControl() {
    return this.dataInputService.vehicleAxleLoadControl;
  }
}
