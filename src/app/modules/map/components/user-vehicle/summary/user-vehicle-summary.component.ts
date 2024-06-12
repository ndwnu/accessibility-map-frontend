import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionsComponent } from '@modules/data-input';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { IconComponent } from '@ndwnu/design-system';
import { DataInputFormGroup } from '@shared/models';
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

  // StepOneForm

  get licensePlate(): string {
    return this.dataInputService.licensePlate;
  }

  get vehicleType(): string {
    return this.dataInputService.vehicleType;
  }

  get height(): number {
    return this.dataInputService.height;
  }

  get trailer(): boolean {
    return this.dataInputService.trailer;
  }

  // StepTwoForm

  get municipalityId(): string {
    return this.dataInputService.municipalityId;
  }

  get destination(): string {
    return this.dataInputService.address;
  }

  get municipalityExemptionUrl(): string {
    const municipalityId = this.municipalityId ?? '';
    const municipality = this.municipalityService.getMunicipality(municipalityId);
    return municipality?.properties?.requestExemptionUrl ?? '';
  }

  get municipalityName(): string {
    return this.municipalityService.getMunicipality(this.municipalityId)?.properties.name ?? '';
  }

  // StepThreeForm

  get vehicleCurbWeight(): number {
    return this.dataInputService.vehicleCurbWeight;
  }

  get vehicleLoad(): number {
    return this.dataInputService.vehicleLoad;
  }

  get vehicleTotalWeight(): number {
    return this.dataInputService.vehicleTotalWeight;
  }

  get vehicleAxleLoad(): number {
    return this.dataInputService.vehicleAxleLoad;
  }

  get vehicleLength(): number {
    return this.dataInputService.vehicleLength;
  }

  get vehicleWidth(): number {
    return this.dataInputService.vehicleWidth;
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
