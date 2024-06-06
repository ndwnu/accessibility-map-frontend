import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionsComponent } from '@modules/data-input';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { VEHICLE_TYPES } from '@modules/map/models';
import { IconComponent } from '@ndwnu/design-system';
import { DataInputFormGroup, StepOneFormGroup, StepTwoFormGroup, StepThreeFormGroup } from '@shared/models';
import { MunicipalityService } from '@shared/services';

@Component({
  selector: 'ber-user-vehicle-summary',
  standalone: true,
  imports: [ActionsComponent, CommonModule, IconComponent, DecimalPipe],
  templateUrl: './user-vehicle-summary.component.html',
  styleUrl: './user-vehicle-summary.component.scss',
})
export class UserVehicleSummaryComponent {
  close = output<void>();

  private municipalityService = inject(MunicipalityService);
  private dataInputService = inject(DataInputService);

  get form(): FormGroup<DataInputFormGroup> {
    return this.dataInputService.form;
  }

  get stepOneForm(): FormGroup<StepOneFormGroup> {
    return this.form.get('stepOne') as FormGroup<StepOneFormGroup>;
  }

  get stepTwoForm(): FormGroup<StepTwoFormGroup> {
    return this.form.get('stepTwo') as FormGroup<StepTwoFormGroup>;
  }

  get stepThreeForm(): FormGroup<StepThreeFormGroup> {
    return this.form.get('stepThree') as FormGroup<StepThreeFormGroup>;
  }

  get licensePlate(): string {
    return this.stepOneForm.get('licensePlate')?.value?.toLocaleUpperCase() ?? '';
  }

  get vehicleType(): string {
    const vehicleTypeKey = this.stepOneForm.get('vehicleType')?.value;
    return vehicleTypeKey ? VEHICLE_TYPES[vehicleTypeKey] : '';
  }

  get height(): number {
    return this.stepOneForm.get('height')?.value ?? 0;
  }

  get trailer(): boolean {
    return this.stepOneForm.get('trailer')?.value ?? false;
  }

  get municipalityName(): string {
    const municipalityId = this.stepTwoForm.get('municipalityId')?.value ?? '';
    const municipality = this.municipalityService.getSyncMunicipality(municipalityId);
    return municipality?.properties?.name ?? '';
  }

  get municipalityExemptionUrl(): string {
    const municipalityId = this.stepTwoForm.get('municipalityId')?.value ?? '';
    const municipality = this.municipalityService.getSyncMunicipality(municipalityId);
    return municipality?.properties?.requestExemptionUrl ?? '';
  }

  get vehicleCurbWeight(): number {
    return this.stepThreeForm.get('vehicleCurbWeight')?.value ?? 0;
  }

  get vehicleLoad(): number {
    return this.stepThreeForm.get('vehicleLoad')?.value ?? 0;
  }

  get vehicleTotalWeight(): number {
    return this.stepThreeForm.get('vehicleTotalWeight')?.value ?? 0;
  }

  get vehicleAxleLoad(): number {
    return this.stepThreeForm.get('vehicleAxleLoad')?.value ?? 0;
  }

  get vehicleLength(): number {
    return this.stepThreeForm.get('vehicleLength')?.value ?? 0;
  }

  get vehicleWidth(): number {
    return this.stepThreeForm.get('vehicleWidth')?.value ?? 0;
  }

  onEditStep(step: number) {
    this.dataInputService.setActiveStep(step);
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }

  startWithNewInput() {
    this.dataInputService.resetForm();
    this.dataInputService.setActiveStep(1);
    this.onClose();
  }
}
