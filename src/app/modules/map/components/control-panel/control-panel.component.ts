import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { LegendComponent } from '@modules/map/components/legend/legend.component';
import {
  CheckboxComponent,
  FormFieldComponent,
  SwitcherComponent,
  SwitcherOption,
  SwitcherValue,
} from '@ndwnu/design-system';
import {
  AccessibilityDataOldService,
  AccessibilityDataService,
  PdokLookupService,
  DetailOption,
} from '@shared/services';

@Component({
  selector: 'ber-control-panel',
  imports: [CommonModule, LegendComponent, FormFieldComponent, CheckboxComponent, SwitcherComponent],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss',
})
export class ControlPanelComponent {
  readonly #dataInputService = inject(DataInputService);
  readonly #accessibilityDataService = inject(AccessibilityDataService);
  readonly #accessibilityDataOldService = inject(AccessibilityDataOldService);
  readonly #pdokLookupService = inject(PdokLookupService);

  openModal = output();
  showTrafficSignsLayer = output<boolean>();

  showTrafficSigns = signal(true);
  showDetailedAccessibility = this.#accessibilityDataService.showDetailedAccessibility;
  selectedDetailValue = this.#accessibilityDataService.selectedDetailValue;
  destinationResults = this.#accessibilityDataService.destinationResults;
  filterContainsCoordinates$ = this.#accessibilityDataOldService.filterContainsCoordinates$;

  get isAddressControlDirty() {
    return this.#dataInputService.municipalityIdControl.dirty;
  }

  get address(): string {
    return this.#pdokLookupService.pdokLookup()?.weergavenaam || '';
  }

  get isLicensePlateControlDirty() {
    return this.#dataInputService.licensePlateControl.dirty;
  }

  get licensePlate() {
    return this.#dataInputService.licensePlate;
  }

  get unknownLicensePlate() {
    return this.#dataInputService.unknownLicensePlate;
  }

  get vehicleType() {
    return this.#dataInputService.vehicleType;
  }

  get isLicensePlateValid(): boolean {
    return !!this.licensePlate && !this.unknownLicensePlate;
  }

  get isLicensePlateInvalid(): boolean {
    return this.unknownLicensePlate && !!this.vehicleType;
  }

  detailOptions: SwitcherOption[] = [
    { value: DetailOption.Vehicle, label: 'Voertuig', icon: 'local_shipping' },
    { value: DetailOption.Emission, label: 'Emissie', icon: 'nature' },
  ];

  onDetailChange(event: SwitcherValue) {
    this.selectedDetailValue.set(event as DetailOption);
  }

  toggleTrafficSigns() {
    this.showTrafficSigns.set(!this.showTrafficSigns());
    this.showTrafficSignsLayer.emit(this.showTrafficSigns());
  }

  toggleDetailedAccessibility() {
    this.showDetailedAccessibility.update((b) => !b);
    // Also update old service for backward compatibility with AccessibilityLayer
    this.#accessibilityDataOldService.setShowDetailedAccessibility(this.showDetailedAccessibility());
  }
}
