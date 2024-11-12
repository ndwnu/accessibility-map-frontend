import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  OnInit,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { environment } from '@env/environment';
import { StepOneComponent, StepThreeComponent, StepTwoComponent } from '@modules/data-input';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { mapToNlsVehicleType } from '@modules/map/models';
import { MainNavigationComponent, ToastService } from '@ndwnu/design-system';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DisclaimerCardComponent } from '@shared/components/disclaimer-card';
import { OVERLAY_MODAL_BASE_CONFIG } from '@shared/constants/overlay.constants';
import { AccessibilityFilter, exampleVehicleInfoList, VehicleInfo } from '@shared/models';
import { AccessibilityDataService, MapService, MunicipalityService } from '@shared/services';
import { DestinationDataService } from '@shared/services/destination-data.service';
import { extractPdokLngLatValue } from '@shared/utils/geo-utils';
import { LngLatLike } from 'maplibre-gl';

@UntilDestroy()
@Component({
  selector: 'ber-user-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    DisclaimerCardComponent,
    MainNavigationComponent,
    RouterOutlet,
    StepOneComponent,
    StepThreeComponent,
    StepTwoComponent,
  ],
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

  private readonly accessibilityDataService = inject(AccessibilityDataService);
  private readonly dataInputService = inject(DataInputService);
  private readonly destinationDataService = inject(DestinationDataService);
  private readonly mapService = inject(MapService);
  private readonly municipalityService = inject(MunicipalityService);
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

    this.accessibilityDataService.showDisclaimer$.subscribe(() => {
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
      .getInaccessibleRoadSections(this.mapFormToFilterCriteria())
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response) => {
          this.destinationDataService.clearDestinationPoint();
          this.accessibilityDataService.setInaccessibleRoadSections(response.inaccessibleRoadSections);
          this.accessibilityDataService.setMatchedRoadSection(response.matchedRoadSection);
          this.accessibilityDataService.setSelectedMunicipalityId(this.dataInputService.municipalityId);
          this.zoomToDestination();
        },
        error: () => {
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

    let vehicleLoad =
      vehicleInfo.maxWeight && vehicleInfo.weight ? Math.round(vehicleInfo.maxWeight - vehicleInfo.weight) : 0;
    if (this.trailerControl.value) {
      vehicleLoad += vehicleInfo.trailerWeight ?? 0;
    }
    const vehicleAxleLoad = vehicleInfo.maxAxleWeight ? vehicleInfo.maxAxleWeight : 0;
    this.stepThreeForm?.patchValue({
      vehicleCurbWeight: vehicleInfo.weight,
      vehicleLoad,
      vehicleTotalWeight: this.trailerControl.value
        ? vehicleInfo.combinedMaxWeight ?? vehicleInfo.maxWeight
        : vehicleInfo.maxWeight,
      vehicleAxleLoad,
      vehicleLength: vehicleInfo.length,
      vehicleWidth: vehicleInfo.width,
    });

    this.stepThreeForm?.get('vehicleLoad')?.setValidators([Validators.required, Validators.max(vehicleLoad)]);
    this.stepThreeForm?.get('vehicleAxleLoad')?.setValidators([Validators.required, Validators.max(vehicleAxleLoad)]);
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
    return {
      municipalityId: stepTwo.municipalityId!,
      vehicleType: mapToNlsVehicleType(stepOne.vehicleType!),
      vehicleLength: stepThree.vehicleLength!,
      vehicleWidth: stepThree.vehicleWidth!,
      vehicleHeight: stepOne.height!,
      vehicleWeight: stepThree.vehicleTotalWeight! / 1000,
      vehicleAxleWeight: stepThree.vehicleAxleLoad! / 1000,
      vehicleHasTrailer: stepOne.trailer!,
      latitude: stepTwo.latitude ?? undefined,
      longitude: stepTwo.longitude ?? undefined,
    };
  }

  private showDisclaimer() {
    const templatePortal = new TemplatePortal(this.disclaimerRef(), this.viewContainerRef);
    this.overlayRef.attach(templatePortal);
  }

  private zoomToDestination() {
    const chosenMunicipality = this.municipalityService.getMunicipality(this.dataInputService.municipalityId);
    if (!chosenMunicipality) throw Error('Municipality is required');

    // Always set max bounds, as every destination always has a municipality
    this.mapService.setMaxBounds(chosenMunicipality.properties.bounds);

    if (!this.dataInputService.pdokData) return;

    const centerPoint = extractPdokLngLatValue(this.dataInputService.pdokData.centroide_ll);

    if (this.dataInputService.pdokData.type !== 'gemeente') {
      this.destinationDataService.setDestinationPoint(centerPoint);
      this.mapService.jumpTo(centerPoint as LngLatLike);
    } else {
      this.mapService.setCenter(centerPoint as LngLatLike);
    }
  }
}
