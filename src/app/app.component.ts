import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconService, MainNavigationComponent, MenuItem, NdwBrand } from '@ndwnu/design-system';
import icons from '@ndwnu/design-system/assets/icons/icons.json';

@Component({
  selector: 'ber-root',
  standalone: true,
  imports: [CommonModule, MainNavigationComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  brandEnum = NdwBrand;

  menuItems: MenuItem[] = [
    {
      icon: 'map',
      id: 0,
      label: 'Kaart',
    },
  ];

  private readonly iconService = inject(IconService);

  ngOnInit() {
    this.iconService.setIcons(icons);
  }
}
