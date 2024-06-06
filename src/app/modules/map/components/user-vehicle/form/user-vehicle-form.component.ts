import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { StepOneComponent, StepThreeComponent, StepTwoComponent } from '@modules/data-input';
import { DataInputService } from '@modules/data-input/services/data-input.service';
import { mapToNlsVehicleType } from '@modules/map/models';
import { MainNavigationComponent } from '@ndwnu/design-system';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  VehicleInfo,
  StepOneFormGroup,
  StepTwoFormGroup,
  StepThreeFormGroup,
  AccessibilityFilter,
  exampleVehicleInfoList,
} from '@shared/models';
import { AccessibilityDataService, MapService, MunicipalityService } from '@shared/services';

@UntilDestroy()
@Component({
  selector: 'ber-user-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
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

  vehicleInfo = signal<VehicleInfo | undefined>(undefined);
  loading = signal(false);

  private readonly accessibilityDataService = inject(AccessibilityDataService);
  private readonly map = inject(MapService);
  private readonly municipalityService = inject(MunicipalityService);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly dataInputService = inject(DataInputService);

  private overlayRef!: OverlayRef;

  protected form = this.dataInputService.form;

  constructor() {
    effect(() => {
      this.closeModal();
      this.openModal(this.dataInputService.activeStep());
    });
  }

  protected get stepOneForm() {
    return this.form.get('stepOne') as FormGroup<StepOneFormGroup>;
  }

  protected get stepTwoForm() {
    return this.form.get('stepTwo') as FormGroup<StepTwoFormGroup>;
  }

  protected get stepThreeForm() {
    return this.form.get('stepThree') as FormGroup<StepThreeFormGroup>;
  }

  ngOnInit() {
    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy,
    });

    this.goToStep(1);
    this.listenToVehicleTypeChanges();
  }

  goToMap() {
    this.loading.set(true);
    this.accessibilityDataService
      .getInaccessibleRoadSections(this.mapFormToFilterCriteria())
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response) => {
          this.accessibilityDataService.setInaccessibleRoadSections(response.inaccessibleRoadSections);
          this.accessibilityDataService.setSelectedMunicipalityId(this.form.value.stepTwo?.municipalityId!);
          this.zoomToMunicipality();
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.loading.set(false);
          this.dataInputService.setActiveStep(0);
          this.closeModal();
        },
      });
  }

  goToStep(step: number) {
    this.dataInputService.setActiveStep(step);
  }

  setVehicleInfo(vehicleInfo: VehicleInfo) {
    // Todo: why is this done, this overrides height input by user
    //this.stepOneForm?.get('height')?.setValue(vehicleInfo.height, { emitEvent: false });
    this.stepOneForm?.get('vehicleType')?.setValue(vehicleInfo.type, { emitEvent: false });

    const vehicleLoad =
      vehicleInfo.maxWeight && vehicleInfo.weight ? Math.round(vehicleInfo.maxWeight - vehicleInfo.weight) : 0;
    const vehicleAxleLoad = vehicleInfo.maxAxleWeight ? vehicleInfo.maxAxleWeight : 0;
    this.stepThreeForm?.patchValue({
      vehicleCurbWeight: vehicleInfo.weight,
      vehicleLoad,
      vehicleTotalWeight: vehicleInfo.maxWeight,
      vehicleAxleLoad,
      vehicleLength: vehicleInfo.length,
      vehicleWidth: vehicleInfo.width,
    });

    this.stepThreeForm?.get('vehicleLoad')?.setValidators([Validators.required, Validators.max(vehicleLoad)]);
    this.stepThreeForm?.get('vehicleAxleLoad')?.setValidators([Validators.required, Validators.max(vehicleAxleLoad)]);
    this.vehicleInfo.set(vehicleInfo);
  }

  private closeModal() {
    this.overlayRef?.detach();
  }

  private openModal(step: number) {
    if (step === 0) return;

    let contentRef: TemplateRef<unknown> = this.stepOneRef();
    if (step === 2) {
      contentRef = this.stepTwoRef();
    }
    if (step === 3) {
      contentRef = this.stepThreeRef();
    }

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
    };
  }

  private zoomToMunicipality() {
    const chosenMunicipality = this.municipalityService.getSyncMunicipality(this.form.value.stepTwo?.municipalityId!);
    if (chosenMunicipality) {
      this.map.fitBounds(chosenMunicipality.properties.bounds);
    }
  }
}
