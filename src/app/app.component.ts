import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent, MenuItem } from '@ndwnu/design-system';
import { AccessibilityModalService, MunicipalityService } from '@shared/services';

@Component({
  selector: 'ber-root',
  imports: [LayoutComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly #modalService = inject(AccessibilityModalService);
  readonly #municipalityService = inject(MunicipalityService);

  footerTexts = ['Versie 0.0.3-beta'];

  topMenuItems: MenuItem[] = [
    {
      icon: 'map',
      label: 'Kaart',
    },
  ];

  bottomMenuItems: MenuItem[] = [
    {
      callback: () => this.openFeedbackMail(),
      icon: 'feedback',
      label: 'Feedback',
    },
    {
      callback: () => this.openDisclaimerModal(),
      icon: 'error',
      label: 'Disclaimer',
    },
  ];

  ngOnInit() {
    this.#municipalityService.loadMunicipalities();
  }

  openDisclaimerModal() {
    this.#modalService.openDisclaimer();
  }

  openFeedbackMail() {
    const email = 'mail@servicedeskndw.nu';
    const subject = 'Feedback over de Bereikbaarheidskaart';
    const body = 'Beste klantenservice van de Bereikbaarheidskaart,\n\n\n';

    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
  }
}
