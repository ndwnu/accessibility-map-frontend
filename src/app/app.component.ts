import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconService, MainNavigationComponent, MenuItem, NdwBrand } from '@ndwnu/design-system';
import icons from '@ndwnu/design-system/assets/icons/icons.json';
import { AccessibilityDataService, MunicipalityService } from '@shared/services';

@Component({
  selector: 'ber-root',
  standalone: true,
  imports: [CommonModule, MainNavigationComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly accessibilityDataService = inject(AccessibilityDataService);

  brandEnum = NdwBrand;

  footerTexts = ['Versie 0.0.3'];

  topMenuItems: MenuItem[] = [
    {
      icon: 'map',
      id: 0,
      label: 'Kaart',
    },
  ];

  bottomMenuItems: MenuItem[] = [
    {
      icon: 'error',
      id: 1,
      label: 'Disclaimer',
    },
  ];

  private readonly iconService = inject(IconService);
  private readonly municipalityService = inject(MunicipalityService);

  ngOnInit() {
    this.iconService.setIcons(icons);
    this.municipalityService.loadMunicipalities();
  }

  onMenuItemSelected(id: number) {
    if (id === 1) {
      this.accessibilityDataService.showDisclaimer$.next();
    }
  }
}
