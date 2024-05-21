import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { StepOneComponent, StepThreeComponent, StepTwoComponent } from '@modules/data-input';
import { IconService, MainNavigationComponent, MenuItem, NdwBrand } from '@ndwnu/design-system';
import icons from '@ndwnu/design-system/assets/icons/icons.json';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  AccessibilityFilter,
  DataInputFormGroup,
  exampleVehicleInfoList,
  StepOneFormGroup,
  StepThreeFormGroup,
  StepTwoFormGroup,
  VehicleInfo,
} from '@shared/models';
import { AccessibilityDataService, MapService, MunicipalityService, RdwService } from '@shared/services';

@UntilDestroy()
@Component({
  selector: 'ber-root',
  standalone: true,
  imports: [
    CommonModule,
    MainNavigationComponent,
    RouterOutlet,
    StepOneComponent,
    StepThreeComponent,
    StepTwoComponent,
  ],
  providers: [AccessibilityDataService, MapService, MunicipalityService, RdwService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  stepOneRef = viewChild.required<TemplateRef<StepOneComponent>>('stepOne');
  stepTwoRef = viewChild.required<TemplateRef<StepTwoComponent>>('stepTwo');
  stepThreeRef = viewChild.required<TemplateRef<StepThreeComponent>>('stepThree');

  brandEnum = NdwBrand;

  menuItems: MenuItem[] = [
    {
      icon: 'map',
      id: 0,
      label: 'Kaart',
    },
  ];
  vehicleInfo = signal<VehicleInfo | undefined>(undefined);
  loading = signal(false);

  private readonly accessibilityDataService = inject(AccessibilityDataService);
  private readonly iconService = inject(IconService);
  private readonly map = inject(MapService);
  private readonly municipalityService = inject(MunicipalityService);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private overlayRef!: OverlayRef;

  protected form = new FormGroup<DataInputFormGroup>({
    // TODO: form is invalid after selecting vehicleType and then selecting licensePlate
    stepOne: new FormGroup<StepOneFormGroup>(
      {
        licensePlate: new FormControl(null),
        unknownLicensePlate: new FormControl(false),
        vehicleType: new FormControl(null),
        height: new FormControl(null, [Validators.required, Validators.min(0)]),
        trailer: new FormControl(false),
      },
      [this.eitherVehicleTypeOrLicensePlate()],
    ),
    stepTwo: new FormGroup<StepTwoFormGroup>({
      municipalityId: new FormControl(null, Validators.required),
    }),

    stepThree: new FormGroup<StepThreeFormGroup>({
      vehicleCurbWeight: new FormControl(0),
      vehicleLoad: new FormControl(null, [Validators.required, Validators.min(0)]),
      vehicleTotalWeight: new FormControl(0),
      vehicleAxleLoad: new FormControl(null, [Validators.required, Validators.min(0)]),
      vehicleLength: new FormControl(null, [Validators.required, Validators.min(0)]),
      vehicleWidth: new FormControl(null, [Validators.required, Validators.min(0)]),
    }),
  });

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
    this.iconService.setIcons(icons);

    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy,
    });

    this.openModal(1);
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
          this.zoomToMunicipality();
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.loading.set(false);
          this.closeModal();
        },
      });
  }

  goToStep(step: number) {
    this.closeModal();
    this.openModal(step);
  }

  setVehicleInfo(vehicleInfo: VehicleInfo) {
    this.stepOneForm?.get('height')?.setValue(vehicleInfo.height, { emitEvent: false });
    this.stepOneForm?.get('vehicleType')?.setValue(vehicleInfo.type, { emitEvent: false });

    const vehicleLoad =
      vehicleInfo.maxWeight && vehicleInfo.weight ? Math.round(vehicleInfo.maxWeight - vehicleInfo.weight) : 0;
    const vehicleAxleLoad = vehicleInfo.maxAxleWeight ? vehicleInfo.maxAxleWeight : 0;
    this.stepThreeForm?.patchValue({
      vehicleCurbWeight: vehicleInfo.weight ?? 0,
      vehicleLoad,
      vehicleTotalWeight: vehicleInfo.maxWeight ?? 0,
      vehicleAxleLoad,
      vehicleLength: vehicleInfo.length ?? 0,
      vehicleWidth: vehicleInfo.width ?? 0,
    });
    this.stepThreeForm?.get('vehicleLoad')?.setValidators([Validators.required, Validators.max(vehicleLoad)]);
    this.stepThreeForm?.get('vehicleAxleLoad')?.setValidators([Validators.required, Validators.max(vehicleAxleLoad)]);
    this.vehicleInfo.set(vehicleInfo);
  }

  private closeModal() {
    this.overlayRef?.detach();
  }

  private openModal(step: number) {
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
      vehicleType: stepOne.vehicleType!,
      vehicleLength: stepThree.vehicleLength!,
      vehicleWidth: stepThree.vehicleWidth!,
      vehicleHeight: stepOne.height!,
      vehicleWeight: stepThree.vehicleTotalWeight! / 1000,
      vehicleAxleWeight: stepThree.vehicleAxleLoad! / 1000,
      vehicleHasTrailer: stepOne.trailer!,
    };
  }

  private eitherVehicleTypeOrLicensePlate(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const licensePlate = group.get('licensePlate')?.value;
      const vehicleType = group.get('vehicleType')?.value;

      if (licensePlate || vehicleType) {
        return null;
      } else {
        return { eitherVehicleTypeOrLicensePlate: true };
      }
    };
  }

  private zoomToMunicipality() {
    const chosenMunicipality = this.municipalityService.getSyncMunicipality(this.form.value.stepTwo?.municipalityId!);
    if (chosenMunicipality) {
      this.map.fitBounds(chosenMunicipality.properties.bounds);
    }
  }
}
