import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import {
  defaultMaxCombinedWeight,
  maxDummyAxleWeight,
  maxDummyVehicleTotalWeight,
  StepOneComponent,
  StepThreeComponent,
  StepTwoComponent,
} from '@modules/data-input';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { mapToNlsVehicleType } from '@modules/map/models';
import { ToastService } from '@ndwnu/design-system';
import { DisclaimerCardComponent } from '@shared/components/disclaimer-card';
import { OVERLAY_MODAL_BASE_CONFIG } from '@shared/constants/overlay.constants';
import { AccessibilityFilter, exampleVehicleInfoList, VehicleInfo } from '@shared/models';
import {
  AccessibilityDataOldService,
  AccessibilityDataService,
  MapService,
  MunicipalityService,
  PdokLookupService,
} from '@shared/services';
import { RoadOperatorService } from '@shared/services/road-operator.service';
import { extractPdokLngLatValue } from '@shared/utils/geo-utils';
import { LngLatLike } from 'maplibre-gl';
import { delay, map, switchMap } from 'rxjs';

@Component({
  selector: 'ber-user-vehicle-form',
  imports: [DisclaimerCardComponent, StepOneComponent, StepThreeComponent, StepTwoComponent],
  templateUrl: './user-vehicle-form.component.html',
})
export class UserVehicleFormComponent implements OnInit {
  stepOneRef = viewChild.required<TemplateRef<StepOneComponent>>('stepOne');
  stepTwoRef = viewChild.required<TemplateRef<StepTwoComponent>>('stepTwo');
  stepThreeRef = viewChild.required<TemplateRef<StepThreeComponent>>('stepThree');
  disclaimerRef = viewChild.required<TemplateRef<DisclaimerCardComponent>>('disclaimer');

  vehicleInfo = signal<VehicleInfo | undefined>(undefined);
  loading = signal(false);
  modalClosed = output();

  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly #pdokLookupService = inject(PdokLookupService);
  readonly #destroyRef = inject(DestroyRef);
  private readonly accessibilityDataOldService = inject(AccessibilityDataOldService);
  private readonly accessibilityDataService = inject(AccessibilityDataService);
  private readonly dataInputService = inject(DataInputService);
  private readonly mapService = inject(MapService);
  private readonly municipalityService = inject(MunicipalityService);
  private readonly roadOperatorService = inject(RoadOperatorService);
  private readonly toastService = inject(ToastService);

  private overlayRef!: OverlayRef;
  private currentStep = -1;
  private disclaimerAccepted = false;

  protected form = this.dataInputService.form;

  constructor() {
    effect(() => {
      this.openModal(this.dataInputService.activeStep());
    });
  }

  protected get stepOneForm() {
    return this.dataInputService.stepOneForm;
  }

  protected get stepTwoForm() {
    return this.dataInputService.stepTwoForm;
  }

  protected get stepThreeForm() {
    return this.dataInputService.stepThreeForm;
  }

  protected get trailerControl() {
    return this.dataInputService.trailerControl;
  }

  get licensePlate() {
    return this.dataInputService.licensePlate;
  }

  ngOnInit() {
    if (environment.mock) {
      this.disclaimerAccepted = true;
    }

    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
    this.overlayRef = this.overlay.create({
      ...OVERLAY_MODAL_BASE_CONFIG,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.goToStep(1);
    this.listenToVehicleTypeChanges();

    this.accessibilityDataOldService.showDisclaimer$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      this.showDisclaimer();
    });
  }

  closeModal(isDisclaimer?: boolean) {
    this.overlayRef?.detach();
    if (this.currentStep === 3 && !this.disclaimerAccepted) {
      this.showDisclaimer();
      return;
    }
    if (isDisclaimer) {
      this.disclaimerAccepted = true;
    }
  }

  goToMap() {
    this.loading.set(true);
    this.accessibilityDataService
      .getRoadAccessibility(this.mapFormToFilterCriteria(), { showDisclaimer: !this.disclaimerAccepted })
      .pipe(
        map(() => {
          this.accessibilityDataOldService.setFilter(this.mapFormToFilterCriteria());
          this.zoomToDestination();
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        error: (err) => {
          console.error(err);
          this.toastService.open('Er is iets misgegaan bij het ophalen van de data');
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
          this.dataInputService.setActiveStep(0);
          this.dataInputService.markFormAsPristine();
          this.closeModal();
          this.modalClosed.emit();
        },
      });
  }

  goToStep(step: number) {
    this.dataInputService.setActiveStep(step);
  }

  setVehicleInfo(vehicleInfo: VehicleInfo) {
    this.stepOneForm?.get('vehicleType')?.setValue(vehicleInfo.type, { emitEvent: false });
    const maxWeight = this.trailerControl.value
      ? (vehicleInfo.combinedMaxWeight ?? defaultMaxCombinedWeight)
      : vehicleInfo.maxWeight;

    let vehicleLoad = maxWeight && vehicleInfo.weight ? Math.round(maxWeight - vehicleInfo.weight) : 0;
    if (this.trailerControl.value) {
      vehicleLoad += vehicleInfo.trailerWeight ?? 0;
    }
    const vehicleAxleLoad = vehicleInfo.maxAxleWeight ? vehicleInfo.maxAxleWeight : 0;
    this.stepThreeForm?.patchValue({
      vehicleCurbWeight: vehicleInfo.weight,
      vehicleLoad,
      vehicleTotalWeight: this.trailerControl.value
        ? (vehicleInfo.combinedMaxWeight ?? defaultMaxCombinedWeight)
        : vehicleInfo.maxWeight,
      vehicleAxleLoad,
      vehicleLength: vehicleInfo.length,
      vehicleWidth: vehicleInfo.width,
      vehicleEmissionClass: vehicleInfo.emissionClass,
    });

    const fuelTypeArray = this.stepThreeForm?.get('vehicleFuelTypes') as FormArray;
    if (fuelTypeArray && vehicleInfo.fuelTypes) {
      fuelTypeArray.clear();
      vehicleInfo.fuelTypes.forEach((fuelType) => {
        fuelTypeArray.push(new FormControl(fuelType));
      });
    }

    if (this.licensePlate) {
      this.stepThreeForm?.get('vehicleLoad')?.setValidators([Validators.required, Validators.max(vehicleLoad)]);
      this.stepThreeForm?.get('vehicleAxleLoad')?.setValidators([Validators.required, Validators.max(vehicleAxleLoad)]);
    } else {
      vehicleInfo = {
        ...vehicleInfo,
        maxAxleWeight: 11500,
      };
      this.stepThreeForm
        ?.get('vehicleLoad')
        ?.setValidators([Validators.required, Validators.max(maxDummyVehicleTotalWeight)]);
      this.stepThreeForm
        ?.get('vehicleTotalWeight')
        ?.setValidators([Validators.required, Validators.max(maxDummyVehicleTotalWeight)]);
      this.stepThreeForm
        ?.get('vehicleAxleLoad')
        ?.setValidators([Validators.required, Validators.max(maxDummyAxleWeight)]);
    }
    this.vehicleInfo.set(vehicleInfo);
  }

  private openModal(step: number) {
    this.currentStep = step;
    if (step === 0) return;

    let contentRef: TemplateRef<unknown> = this.stepOneRef();
    if (step === 2) {
      contentRef = this.stepTwoRef();
    }
    if (step === 3) {
      contentRef = this.stepThreeRef();
    }

    this.overlayRef.detach();
    const templatePortal = new TemplatePortal(contentRef, this.viewContainerRef);
    this.overlayRef.attach(templatePortal);
  }

  private listenToVehicleTypeChanges() {
    this.stepOneForm?.get('vehicleType')?.valueChanges.subscribe((vehicleType) => {
      if (vehicleType) {
        this.stepOneForm?.get('licensePlate')?.setValue(null);
        const vehicleInfo = exampleVehicleInfoList.find((info) => info.type === vehicleType)!;
        this.setVehicleInfo(vehicleInfo);
        this.stepOneForm.get('height')?.setValue(vehicleInfo.height);
      }
    });
  }

  private mapFormToFilterCriteria(): AccessibilityFilter {
    const { stepOne, stepTwo, stepThree } = this.form.getRawValue();
    const pdokLookup = this.#pdokLookupService.pdokLookup();
    const municipalityId = pdokLookup?.gemeentecode;
    const isStreet = pdokLookup?.type !== 'gemeente';
    const centerPoint = isStreet ? this.#pdokLookupService.centerPoint() : undefined;
    return {
      municipalityId: municipalityId ? `GM${municipalityId}` : '',
      vehicleType: mapToNlsVehicleType(stepOne.vehicleType!),
      vehicleLength: stepThree.vehicleLength!,
      vehicleWidth: stepThree.vehicleWidth!,
      vehicleHeight: stepOne.height!,
      vehicleWeight: stepThree.vehicleTotalWeight! / 1000,
      vehicleAxleLoad: stepThree.vehicleAxleLoad! / 1000,
      vehicleHasTrailer: stepOne.trailer!,
      latitude: centerPoint ? centerPoint[1] : undefined,
      longitude: centerPoint ? centerPoint[0] : undefined,
      emissionClass: stepThree.vehicleEmissionClass ?? undefined,
      fuelTypes: stepThree.vehicleFuelTypes ?? undefined,
    };
  }

  private showDisclaimer() {
    const templatePortal = new TemplatePortal(this.disclaimerRef(), this.viewContainerRef);
    this.overlayRef.attach(templatePortal);
  }

  private zoomToDestination() {
    const chosenMunicipality = this.municipalityService.getMunicipality(this.#pdokLookupService.municipalityId()!);
    if (!chosenMunicipality) throw new Error('Municipality is required');

    // Always set max bounds, as every destination always has a municipality
    this.mapService.setMaxBounds(chosenMunicipality.properties.bounds);
    const pdokLookup = this.#pdokLookupService.pdokLookup();
    if (!pdokLookup) return;

    const centerPoint = extractPdokLngLatValue(pdokLookup.centroide_ll);

    if (pdokLookup.type !== 'gemeente') {
      this.mapService.jumpTo(centerPoint as LngLatLike);
    } else {
      this.mapService.setCenter(centerPoint as LngLatLike);
    }
  }
}
