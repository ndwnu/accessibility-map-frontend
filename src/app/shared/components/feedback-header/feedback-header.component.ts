import { Component, input } from '@angular/core';
import { IconComponent } from '@ndwnu/design-system';

@Component({
  selector: 'ber-feedback-header',
  standalone: true,
  imports: [IconComponent],
  styleUrl: './feedback-header.component.scss',
  templateUrl: './feedback-header.component.html',
})
export class FeedbackHeaderComponent {
  title = input('');

  getMailToLink(): string {
    const email = 'mail@servicedeskndw.nu';
    const subject = 'Feedback over de Bereikbaarheidskaart';
    const body = 'Beste klantenservice van de Bereikbaarheidskaart,\n\n\n';

    return `mailto:${email}?subject=${subject}&body=${body}`;
  }
}
