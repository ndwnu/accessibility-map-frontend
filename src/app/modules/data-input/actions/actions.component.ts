import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ber-actions',
  standalone: true,
  imports: [],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
})
export class ActionsComponent {
  currentStep = input.required<number>();
  steps = input.required<number>();
  disableComplete = input(false);
  disableNext = input(false);

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
