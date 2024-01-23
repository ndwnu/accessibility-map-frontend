/* eslint-disable @angular-eslint/no-input-rename */
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VEHICLE_TYPES, VehicleType } from '@modules/map/models';
import { FormControlValidationComponent } from '@shared/components/form-control-validation/form-control-validation.component';
import { MuncipalityFeature } from '@shared/models';

@Component({
  selector: 'ber-map-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormControlValidationComponent],
  templateUrl: './map-form.component.html',
})
export class MapFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() municipalities: MuncipalityFeature[] = [];
  vehicleWeightRequired = signal<boolean>(false);
  @Input({ alias: 'vehicleWeightRequired' }) set _vehicleWeightRequired(required: boolean | undefined) {
    if (required === undefined) return;
    this.vehicleWeightRequired.set(required);
    const vehicleWeightControl = this.form.controls['vehicleWeight'];
    if (this.form) {
      vehicleWeightControl.addValidators(required ? [Validators.required] : []);
      vehicleWeightControl.removeValidators(required ? [] : [Validators.required]);
      vehicleWeightControl.updateValueAndValidity();
    }
  }
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter();

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
}
