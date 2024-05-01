import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '@ndwnu/design-system';
import { DataInputFormGroup, VehicleInfo } from '@shared/models';
import { AccessibilityDataService } from '@shared/services';

import { ActionsComponent } from '../actions';

@Component({
  selector: 'ber-step-three',
  standalone: true,
  imports: [ActionsComponent, CardComponent, CommonModule, ReactiveFormsModule],
  providers: [AccessibilityDataService],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss',
})
export class StepThreeComponent {
  form = input.required<FormGroup<DataInputFormGroup>>();
  vehicleInfo = input<VehicleInfo>();

  complete = output<void>();
  previous = output<void>();

  onComplete() {
    this.complete.emit();
  }

  onPrevious() {
    this.previous.emit();
  }
}
