import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { URL_FIELDS } from '@modules/data-input/url-fields';
import { VehicleType } from '@modules/map/models';
import { FuelType } from '@shared/models/fuel-type.model';
import { PdokLookupService } from '@shared/services/pdok-lookup.service';
import { forkJoin, map, Observable, of, timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeepLinkService {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #dataInputService = inject(DataInputService);
  readonly #pdokLookupService = inject(PdokLookupService);

  tryApplyDeepLink(): Observable<boolean> {
    const params = this.#route.snapshot.queryParamMap;
    const locationId = params.get('locationId');
    if (!params.get('vehicleType') || !locationId) {
      return of(false);
    }

    this.#patchFormFromUrl(params);
    this.#pdokLookupService.selectedSuggestionId.set(locationId);
    // Wait for PDOK to settle (centerPoint + labels) + minimum 1 second
    return forkJoin([this.#pdokLookupService.pdokLookup$.pipe(take(1)), timer(1000)]).pipe(map(() => true));
  }

  writeToUrl() {
    const queryParams = {
      ...this.#serializeFormToUrl(),
      locationId: this.#pdokLookupService.selectedSuggestionId(),
    };
    this.#router.navigate([], { queryParams, replaceUrl: true });
  }

  // vehicleType first so its valueChanges subscription wires validators + defaults.
  // licensePlate last because the same subscription resets it to null.
  #patchFormFromUrl(params: ParamMap): void {
    this.#dataInputService.vehicleTypeControl.setValue(params.get('vehicleType') as VehicleType);
    this.#dataInputService.unknownLicensePlateControl.setValue(!params.has('licensePlate'));

    URL_FIELDS.forEach((field) => {
      const raw = params.get(field.name);
      if (raw === null) {
        return;
      }
      this.#findControl(field.name)?.setValue(field.parse(raw));
    });

    const fuels = params.get('vehicleFuelTypes');
    if (fuels) {
      const fuelArray = this.#dataInputService.vehicleFuelTypesControl;
      fuelArray.clear();
      fuels.split(',').forEach((fuel) => {
        fuelArray.push(new FormControl(fuel as FuelType, { nonNullable: true }));
      });
    }

    this.#dataInputService.licensePlateControl.setValue(params.get('licensePlate'));
  }

  #serializeFormToUrl(): Record<string, string> {
    const url: Record<string, string> = {};

    if (this.#dataInputService.licensePlate) {
      url['licensePlate'] = this.#dataInputService.licensePlate;
    }

    URL_FIELDS.forEach((field) => {
      const value = this.#findControl(field.name)?.value;
      if (value !== false) {
        url[field.name] = String(value);
      }
    });

    const fuels = this.#dataInputService.vehicleFuelTypesControl.value;
    if (fuels.length) {
      url['vehicleFuelTypes'] = fuels.join(',');
    }

    return url;
  }

  #findControl(name: string): AbstractControl | null {
    return (
      this.#dataInputService.stepOneForm.get(name) ??
      this.#dataInputService.stepTwoForm.get(name) ??
      this.#dataInputService.stepThreeForm.get(name)
    );
  }
}
