import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Reason } from '@shared/models/destination.model';
import { ConditionPipe } from '@shared/pipes/condition.pipe';
import { DestinationReasonTypePipe } from '@shared/pipes/destination-reason-type.pipe';
import { UnitSymbolPipe } from '@shared/pipes/unit-symbol.pipe';

@Component({
  selector: 'ber-reasons-list',
  imports: [ConditionPipe, DestinationReasonTypePipe, UnitSymbolPipe],
  templateUrl: './reasons-list.component.html',
  styleUrl: './reasons-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonsListComponent {
  reasons = input.required<Reason[][]>();
}
