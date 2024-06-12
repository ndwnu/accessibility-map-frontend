import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Position } from 'geojson';

@Injectable({
  providedIn: 'root',
})
export class DestinationDataService {
  private destinationPoint = new BehaviorSubject<Position | undefined>(undefined);
  destinationPoint$ = this.destinationPoint.asObservable();

  setDestinationPoint(point: Position) {
    this.destinationPoint.next(point);
  }

  clearDestinationPoint() {
    this.destinationPoint.next(undefined);
  }
}
