/* eslint-disable @angular-eslint/no-input-rename */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VEHICLE_TYPES, VehicleType } from '@modules/map/models';
import { FormControlValidationComponent } from '@shared/components/form-control-validation/form-control-validation.component';
import { MuncipalityFeature } from '@shared/models';

@Component({
  selector: 'ber-map-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormControlValidationComponent],
  templateUrl: './map-form.component.html',
  styleUrl: './map-form.component.scss',
})
export class MapFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() municipalities: MuncipalityFeature[] = [];
  @Input() vehicleWeightRequired = false;
  @Input() loading = false;
  @Input() maxVehicleLoad: number | undefined;
  @Input() maxVehicleAxleWeight: number | undefined;
  @Output() formSubmit = new EventEmitter();
  @Output() fetchInfoClicked = new EventEmitter();
  @Output() formClear = new EventEmitter();

  vehicleTypes = Object.keys(VEHICLE_TYPES).map((key) => ({
    key,
    value: VEHICLE_TYPES[key as VehicleType],
  }));

  submitForm() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit();
  }

  clearForm() {
    this.formClear.emit();
  }
}
