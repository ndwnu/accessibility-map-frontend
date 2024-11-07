import { Component, output } from '@angular/core';
import {
  ButtonDirective,
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent,
  IconComponent,
} from '@ndwnu/design-system';
import { FeedbackHeaderComponent } from '../feedback-header';

@Component({
  selector: 'ber-disclaimer-card',
  standalone: true,
  imports: [
    ButtonDirective,
    CardComponent,
    CardContentComponent,
    CardFooterComponent,
    CardHeaderComponent,
    FeedbackHeaderComponent,
    IconComponent,
  ],
  styleUrl: './disclaimer-card.component.scss',
  templateUrl: './disclaimer-card.component.html',
})
export class DisclaimerCardComponent {
  confirmed = output();

  protected accessibilityMapUrl = 'https://www.ndw.nu/ndw/applicaties/bereikbaarheidskaart';

  confirm() {
    this.confirmed.emit();
  }
}
