import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNavigationComponent, MenuItem, NdwBrand } from '@ndwnu/design-system';
import { DisclaimerCardComponent } from '@shared/components/disclaimer-card';
import { OVERLAY_MODAL_BASE_CONFIG } from '@shared/constants/overlay.constants';
import { AccessibilityDataService, MunicipalityService } from '@shared/services';

@Component({
  selector: 'ber-root',
  standalone: true,
  imports: [CommonModule, DisclaimerCardComponent, MainNavigationComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly #overlay = inject(Overlay);
  readonly #viewContainerRef = inject(ViewContainerRef);

  readonly #accessibilityDataService = inject(AccessibilityDataService);
  readonly #municipalityService = inject(MunicipalityService);

  disclaimerRef = viewChild.required<TemplateRef<DisclaimerCardComponent>>('disclaimer');

  private overlayRef!: OverlayRef;

  brandEnum = NdwBrand;

  footerTexts = ['Versie 0.0.3-beta'];

  topMenuItems: MenuItem[] = [
    {
      icon: 'map',
      id: 0,
      label: 'Kaart',
    },
  ];

  bottomMenuItems: MenuItem[] = [
    {
      callback: () => this.openFeedbackMail(),
      icon: 'feedback',
      id: 1,
      label: 'Feedback',
    },
    {
      callback: () => this.openDisclaimerModal(),
      icon: 'error',
      id: 2,
      label: 'Disclaimer',
    },
  ];

  ngOnInit() {
    this.#municipalityService.loadMunicipalities();

    const positionStrategy = this.#overlay.position().global().centerHorizontally().centerVertically();
    this.overlayRef = this.#overlay.create({
      ...OVERLAY_MODAL_BASE_CONFIG,
      positionStrategy,
      scrollStrategy: this.#overlay.scrollStrategies.reposition(),
    });
  }

  closeDisclaimerModal() {
    this.overlayRef.detach();
  }

  onMenuItemSelected(id: number) {
    if (id === 1) {
      this.#accessibilityDataService.showDisclaimer$.next();
    }
  }

  openDisclaimerModal() {
    const templatePortal = new TemplatePortal(this.disclaimerRef(), this.#viewContainerRef);
    this.overlayRef.attach(templatePortal);
  }

  openFeedbackMail() {
    const email = 'mail@servicedeskndw.nu';
    const subject = 'Feedback over de Bereikbaarheidskaart';
    const body = 'Beste klantenservice van de Bereikbaarheidskaart,\n\n\n';

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
  }
}
