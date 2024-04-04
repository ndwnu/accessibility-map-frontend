import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VEHICLE_TYPES } from '@modules/map/models';
import { CardComponent, FormFieldComponent, InputDirective } from '@noway/ndw';
import { VehicleHeight } from '@shared/models/vehicle-info.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ber-step-one',
  standalone: true,
  imports: [CardComponent, CommonModule, FormFieldComponent, InputDirective, ReactiveFormsModule],
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
})
export class StepOneComponent implements OnDestroy, OnInit {
  form = input.required<FormGroup>();

  next = output<void>();

  licensePlateUnknown = false;
  vehicleHeight = 0;
  vehicleTypes = Object.entries(VEHICLE_TYPES).map(([key, value]) => ({ key, value }));

  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.form()
      .controls['vehicleType'].valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((vehicleType) => {
        this.vehicleHeight = VehicleHeight[vehicleType as keyof typeof VehicleHeight];
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  checkFormValidity(): boolean {
    const invalidActiveInput =
      this.form().controls[this.licensePlateUnknown ? 'vehicleType' : 'licensePlate'].value === null;
    const invalidForm = this.form().untouched || this.form().invalid;
    return invalidActiveInput && invalidForm;
  }

  onNext() {
    this.next.emit();
  }

  toggleLicensePlateUnknown() {
    this.licensePlateUnknown = !this.licensePlateUnknown;
  }
}
