import { Component, computed, output, signal } from '@angular/core';
import { CheckboxComponent, FormFieldComponent, RadioGroupComponent } from '@ndwnu/design-system';
import { NgOptimizedImage } from '@angular/common';
import { LegendComponent } from '@modules/map/components/legend/legend.component';

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

  selectBackgroundLayer(layer: BackgroundLayer) {
    this.activeBackgroundLayer.set(layer.key);
    this.changeBackgroundLayer.emit(layer.key);
  }

  toggleTrafficSigns() {
    this.showTrafficSigns.set(!this.showTrafficSigns());
    this.showTrafficSignsLayer.emit(this.showTrafficSigns());
  }
}
