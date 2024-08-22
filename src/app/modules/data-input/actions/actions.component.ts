import { Component, input, output } from '@angular/core';
import { IconComponent } from '@ndwnu/design-system';

@Component({
  selector: 'ber-actions',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
})
export class ActionsComponent {
  currentStep = input.required<number>();
  steps = input.required<number>();
  disableComplete = input(false);
  disableNext = input(false);
  isLoading = input(false);

  complete = output<void>();
  next = output<void>();
  previous = output<void>();

  onComplete() {
    this.complete.emit();
  }

  onNext() {
    this.next.emit();
  }

  onPrevious() {
    this.previous.emit();
  }
}
