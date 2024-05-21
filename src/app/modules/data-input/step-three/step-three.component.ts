import { CommonModule } from '@angular/common';
import { Component, computed, input, OnInit, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardComponent, FormFieldComponent, InputDirective } from '@ndwnu/design-system';
import { StepThreeFormGroup, VehicleInfo } from '@shared/models';

import { ActionsComponent } from '../actions';

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

  ngOnInit() {
    this.vehicleLoadControl?.valueChanges.subscribe((value) => {
      this.vehicleTotalWeightControl?.patchValue((value ?? 0) + (this.vehicleInfo()?.weight ?? 0));
    });
  }

  onComplete() {
    this.complete.emit();
  }

  onPrevious() {
    this.previous.emit();
  }

  get vehicleTotalWeightControl() {
    return this.form().get('vehicleTotalWeight');
  }
  get vehicleLoadControl() {
    return this.form().get('vehicleLoad');
  }
  get vehicleAxleLoadControl() {
    return this.form().get('vehicleAxleLoad');
  }
}
