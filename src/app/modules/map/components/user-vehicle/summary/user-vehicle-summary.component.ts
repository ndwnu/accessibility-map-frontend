import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionsComponent } from '@modules/data-input';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { CardComponent, IconComponent, PopoverTriggerDirective, ToastService } from '@ndwnu/design-system';
import { DataInputFormGroup } from '@shared/models';
import { AccessibilityDataService, MunicipalityService, TrafficSignService } from '@shared/services';
import { FileDownloadService } from '@shared/services/file-download.service';

@Component({
  selector: 'ber-user-vehicle-summary',
  standalone: true,

  imports: [ActionsComponent, CommonModule, IconComponent, DecimalPipe, PopoverTriggerDirective, CardComponent],
  templateUrl: './user-vehicle-summary.component.html',
  styleUrl: './user-vehicle-summary.component.scss',
})
export class UserVehicleSummaryComponent {
  close = output<void>();

  private readonly municipalityService = inject(MunicipalityService);
  private readonly dataInputService = inject(DataInputService);
  private readonly accessibilityDataService = inject(AccessibilityDataService);
  private readonly trafficSignService = inject(TrafficSignService);
  private readonly toastService = inject(ToastService);

  loadingRoadSections = signal(false);
  loadingTrafficSigns = signal(false);

  get form(): FormGroup<DataInputFormGroup> {
    return this.dataInputService.form;
  }

  get municipalityDateLastCheck(): Date | undefined {
    const dateLastCheck = this.municipalityService.getMunicipality(this.municipalityId)?.properties.dateLastCheck;
    return dateLastCheck ? new Date(dateLastCheck) : undefined;
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

  get pdokData() {
    return this.dataInputService.pdokData;
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
    this.accessibilityDataService.setMatchedRoadSection(undefined);
    this.onClose();
  }

  isDateLessThanSixMonths(date?: Date): boolean {
    if (!date) {
      return false;
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return date > sixMonthsAgo;
  }

  downloadRoadSections() {
    const filter = this.accessibilityDataService.filter;
    if (!filter) {
      return;
    }
    this.loadingRoadSections.set(true);
    this.accessibilityDataService.getInaccessibleRoadSections(filter, true).subscribe({
      next: (response) => {
        FileDownloadService.downloadFile(
          new Blob([JSON.stringify(response)]),
          this.#getFileName('wegvakken'),
          'application/json',
        );
      },
      error: () => {
        this.toastService.open('Er is iets misgegaan bij het ophalen van de wegvakken');
      },
      complete: () => {
        this.loadingRoadSections.set(false);
      },
    });
  }

  downloadTrafficSigns() {
    this.loadingTrafficSigns.set(true);
    const filter = this.accessibilityDataService.filter;
    const vehicleSpecificRvvCodes = this.accessibilityDataService.getRvvCodes(filter);
    this.trafficSignService.getTrafficSigns(this.municipalityId, vehicleSpecificRvvCodes).subscribe({
      next: (response) => {
        FileDownloadService.downloadFile(
          new Blob([JSON.stringify(response)]),
          this.#getFileName('verkeersborden'),
          'application/json',
        );
      },
      error: () => {
        this.toastService.open('Er is iets misgegaan bij het ophalen van de verkeersborden');
      },
      complete: () => {
        this.loadingTrafficSigns.set(false);
      },
    });
  }

  #getFileName(dataName: string): string {
    return `${dataName}-${this.municipalityId}-${this.licensePlate ? this.licensePlate : this.vehicleType}.geojson`;
  }
}
