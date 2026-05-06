import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import {
  ButtonDirective,
  CardComponent,
  CardContentComponent,
  CardHeaderComponent,
  IconComponent,
  TooltipDirective,
} from '@ndwnu/design-system';
import { ReasonsListComponent } from '@shared/components/reasons-list';
import { AccessibilityDataService, PdokLookupService } from '@shared/services';

@Component({
  selector: 'ber-destination-popup',
  imports: [
    ButtonDirective,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    IconComponent,
    TooltipDirective,
    ReasonsListComponent,
  ],
  templateUrl: './destination-popup.component.html',
  styleUrl: './destination-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DestinationPopupComponent {
  readonly #accessibilityDataService = inject(AccessibilityDataService);
  readonly #pdokLookupService = inject(PdokLookupService);

  closed = output();

  destinationResults = this.#accessibilityDataService.destinationResults;
  address = computed(() => this.#pdokLookupService.pdokLookup()?.weergavenaam ?? '');

  close() {
    this.closed.emit();
  }
}
