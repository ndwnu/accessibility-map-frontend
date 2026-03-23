import { DialogRef } from '@angular/cdk/dialog';
import { Component, DestroyRef, effect, inject, OnInit, output, signal, TemplateRef, viewChild } from '@angular/core';
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
import { ModalService as DesignSystemModalService, ToastService } from '@ndwnu/design-system';
import { DisclaimerCardComponent } from '@shared/components/disclaimer-card';
import { AccessibilityFilter, exampleVehicleInfoList, VehicleInfo } from '@shared/models';
import {
  AccessibilityFilterService,
  AccessibilityDataService,
  MapService,
  ModalEnum,
  AccessibilityModalService,
  MunicipalityService,
  PdokLookupService,
} from '@shared/services';
import { extractPdokLngLatValue } from '@shared/utils/geo-utils';
import { LngLatLike } from 'maplibre-gl';
import { map } from 'rxjs';

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

  readonly #pdokLookupService = inject(PdokLookupService);
  readonly #destroyRef = inject(DestroyRef);
  private readonly accessibilityFilterService = inject(AccessibilityFilterService);
  private readonly accessibilityDataService = inject(AccessibilityDataService);
  private readonly dataInputService = inject(DataInputService);
  private readonly mapService = inject(MapService);
  private readonly modalService = inject(AccessibilityModalService);
  private readonly designSystemModalService = inject(DesignSystemModalService);
  private readonly municipalityService = inject(MunicipalityService);
  private readonly toastService = inject(ToastService);

  private currentModalRef: DialogRef<unknown> | null = null;
  private disclaimerAccepted = false;

  protected form = this.dataInputService.form;

  constructor() {
    effect(() => {
      this.openModal(this.modalService.activeModal());
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

    this.goToStep(1);
    this.listenToVehicleTypeChanges();
  }

  closeModal() {
    this.modalService.close();
  }

  confirmDisclaimer() {
    this.disclaimerAccepted = true;
    this.modalService.close();
    this.modalClosed.emit();
  }

  goToMap() {
    this.loading.set(true);
    this.accessibilityDataService
      .getRoadAccessibility(this.mapFormToFilterCriteria(), { showDisclaimer: !this.disclaimerAccepted })
      .pipe(
        map(() => {
          this.accessibilityFilterService.setFilter(this.mapFormToFilterCriteria());
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
          const shouldShowDisclaimer = !this.disclaimerAccepted;
          this.dataInputService.markFormAsPristine();
          if (shouldShowDisclaimer) {
            this.modalService.openDisclaimer();
          } else {
            this.modalService.close();
            this.modalClosed.emit();
          }
        },
      });
  }

  goToStep(step: number) {
    this.modalService.openStep(step);
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

  private openModal(modal: ModalEnum | null) {
    // Close any existing modal first
    this.currentModalRef?.close();
    this.currentModalRef = null;

    if (modal === null) return;

    let contentRef: TemplateRef<unknown>;
    switch (modal) {
      case ModalEnum.Step1:
        contentRef = this.stepOneRef();
        break;
      case ModalEnum.Step2:
        contentRef = this.stepTwoRef();
        break;
      case ModalEnum.Step3:
        contentRef = this.stepThreeRef();
        break;
      case ModalEnum.Disclaimer:
        contentRef = this.disclaimerRef();
        break;
    }

    this.currentModalRef = this.designSystemModalService.open(contentRef);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
