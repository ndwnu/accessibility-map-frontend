import { Component } from '@angular/core';
import {
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent,
  LoaderComponent,
} from '@ndwnu/design-system';

@Component({
  selector: 'ber-loading-card',
  imports: [CardComponent, CardContentComponent, CardHeaderComponent, LoaderComponent, CardFooterComponent],
  styleUrl: './loading-card.component.scss',
  templateUrl: './loading-card.component.html',
})
export class LoadingCardComponent {}
