import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent, MenuItem } from '@ndwnu/design-system';
import { OVERLAY_MODAL_BASE_CONFIG } from '@shared/constants/overlay.constants';
import { AccessibilityDataService, MunicipalityService } from '@shared/services';

@Component({
  selector: 'ber-root',
  imports: [LayoutComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly #overlay = inject(Overlay);

  readonly #accessibilityDataService = inject(AccessibilityDataService);
  readonly #municipalityService = inject(MunicipalityService);

  private overlayRef!: OverlayRef;

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

  openDisclaimerModal() {
    this.#accessibilityDataService.showDisclaimer$.next();
  }

  openFeedbackMail() {
    const email = 'mail@servicedeskndw.nu';
    const subject = 'Feedback over de Bereikbaarheidskaart';
    const body = 'Beste klantenservice van de Bereikbaarheidskaart,\n\n\n';

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
  }
}
