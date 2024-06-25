import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trafficSignOrientation',
  standalone: true,
})
export class TrafficSignOrientationPipe implements PipeTransform {
  private translations: { [key: string]: string } = {
    N: 'Noord',
    O: 'Oost',
    Z: 'Zuid',
    W: 'West',
  };

  transform(value?: string): string {
    if (!value) {
      return 'Onbekend';
    }

    return this.translations[value] || 'Onbekend';
  }
}
