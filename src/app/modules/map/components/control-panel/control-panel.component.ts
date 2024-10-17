import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, output, signal } from '@angular/core';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { LegendComponent } from '@modules/map/components/legend/legend.component';
import { CheckboxComponent, FormFieldComponent, RadioGroupComponent } from '@ndwnu/design-system';

interface BackgroundLayer {
  name: string;
  key: string;
  active: boolean;
}

@Component({
  selector: 'ber-control-panel',
  standalone: true,
  imports: [LegendComponent, FormFieldComponent, RadioGroupComponent, NgOptimizedImage, CheckboxComponent],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss',
})
export class ControlPanelComponent {
  private readonly dataInputService = inject(DataInputService);

  openModal = output();
  changeBackgroundLayer = output<string>();
  showTrafficSignsLayer = output<boolean>();

  activeBackgroundLayer = signal('brt');
  backgroundLayers = computed<BackgroundLayer[]>(() =>
    [
      { name: 'BRT', key: 'brt', active: false },
      { name: 'Luchtfoto', key: 'aerial', active: false },
    ].map((l) => ({ ...l, active: l.key === this.activeBackgroundLayer() })),
  );

  showTrafficSigns = signal(false);

  get isLicensePlateControlDirty() {
    return this.dataInputService.licensePlateControl.dirty;
  }

  get licensePlate() {
    return this.dataInputService.licensePlate;
  }

  get unknownLicensePlate() {
    return this.dataInputService.unknownLicensePlate;
  }

  get vehicleType() {
    return this.dataInputService.vehicleType;
  }

  get isLicensePlateValid(): boolean {
    return !!this.licensePlate && !this.unknownLicensePlate;
  }

  get isLicensePlateInvalid(): boolean {
    return this.unknownLicensePlate && !!this.vehicleType;
  }

  selectBackgroundLayer(layer: BackgroundLayer) {
    this.activeBackgroundLayer.set(layer.key);
    this.changeBackgroundLayer.emit(layer.key);
  }

  toggleTrafficSigns() {
    this.showTrafficSigns.set(!this.showTrafficSigns());
    this.showTrafficSignsLayer.emit(this.showTrafficSigns());
  }
}
