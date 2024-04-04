import { Component } from '@angular/core';
import { CardComponent } from '@noway/ndw';

@Component({
  selector: 'ber-step-two',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss',
})
export class StepTwoComponent {}
