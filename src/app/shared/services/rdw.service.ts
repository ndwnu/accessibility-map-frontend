import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { combineLatest, map, Observable } from 'rxjs';
import { VehicleInfo } from '@shared/models/vehicle-info.model';
import { VehicleType } from '@modules/map/models';
import { RdwAxleResponse, RdwRegisteredVehiclesResponse } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class RdwService {
  private readonly _http = inject(HttpClient);

  registeredVehiclesUrl = environment.rdw.registeredVehicleUrl;
  axleUrl = environment.rdw.axleUrl;

  getVehicleInfo(rawLicensePlate: string): Observable<VehicleInfo | null> {
    const licensePlate = this.toRdwLicensePlate(rawLicensePlate);
    const registeredVehicles = this.getRegisteredVehicles(licensePlate);
    const axleInformation = this.getAxleInformation(licensePlate);

    return combineLatest([registeredVehicles, axleInformation]).pipe(
      map(([vehicleInformation, axles]) => {
        if (vehicleInformation && vehicleInformation.length > 0) {
          return {
            type: this.mapVehicleType(vehicleInformation[0].voertuigsoort),
            length: parseFloat(vehicleInformation[0].lengte) / 100.0,
            width: parseFloat(vehicleInformation[0].breedte) / 100.0,
            height: 0.0,
            emptyWeight: parseFloat(vehicleInformation[0].massa_ledig_voertuig),
            weight: parseFloat(vehicleInformation[0].massa_rijklaar),
            maxWeight: parseFloat(vehicleInformation[0].toegestane_maximum_massa_voertuig),
            maxAxleWeight: this.getMaxAxleWeight(axles),
          } as VehicleInfo;
        } else {
          return null;
        }
      }),
    );
  }

  private getMaxAxleWeight(axleResponse: RdwAxleResponse[]): number | undefined {
    return axleResponse.reduce((max, axle) => Math.max(parseFloat(axle.wettelijk_toegestane_maximum_aslast), max), 0);
  }

  private mapVehicleType(vehicleType: string): VehicleType | undefined {
    switch (vehicleType) {
      case 'Personenauto':
        return 'car';
      case 'Bedrijfsauto (bestelbus)':
        return 'commercial_vehicle_van';
      case 'Bedrijfsauto (vrachtwagen)':
        return 'commercial_vehicle_truck';
      case 'Bus':
        return 'bus';
      case 'Motor':
        return 'motorcycle';
      default:
        return undefined;
    }
  }

  private getRegisteredVehicles(licensePlate: string): Observable<RdwRegisteredVehiclesResponse[]> {
    return this._http.get<RdwRegisteredVehiclesResponse[]>(this.registeredVehiclesUrl + '?kenteken=' + licensePlate);
  }

  private getAxleInformation(licensePlate: string): Observable<RdwAxleResponse[]> {
    return this._http.get<RdwAxleResponse[]>(this.axleUrl + '?kenteken=' + licensePlate);
  }

  private toRdwLicensePlate(licensePlate: string): string {
    return licensePlate.trim().replaceAll('-', '').toLocaleUpperCase();
  }
}
