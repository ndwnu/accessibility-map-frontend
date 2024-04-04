import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewContainerRef, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { IconService, MainNavigationComponent, MenuItem, NdwBrand } from '@noway/ndw';
import icons from '@noway/ndw/assets/icons/icons.json';
import { StepOneComponent, StepTwoComponent } from '@modules/data-input';
import { DataInputFormGroup, StepOneFormGroup } from '@shared/models';

@Component({
  selector: 'ber-root',
  standalone: true,
  imports: [CommonModule, MainNavigationComponent, RouterOutlet, StepOneComponent, StepTwoComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  stepOneRef = viewChild.required<TemplateRef<StepOneComponent>>('stepOne');
  stepTwoRef = viewChild.required<TemplateRef<StepTwoComponent>>('stepTwo');

  brandEnum = NdwBrand;

  menuItems: MenuItem[] = [
    {
      icon: 'map',
      id: 0,
      label: 'Kaart',
    },
  ];

  private readonly iconService = inject(IconService);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private overlayRef!: OverlayRef;

  protected form = new FormGroup<DataInputFormGroup>({
    stepOne: new FormGroup<StepOneFormGroup>({
      licensePlate: new FormControl(null),
      unknownLicensePlate: new FormControl(false),
      vehicleType: new FormControl(null),
      height: new FormControl(null, Validators.required),
      trailer: new FormControl(false),
    }),
  });

  protected get stepOneForm(): FormGroup {
    return this.form.get('stepOne') as FormGroup;
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
  }

  goToNextStep(step: number) {
    this.closeModal();
    this.openModal(step);
  }

  private closeModal() {
    this.overlayRef?.detach();
  }

  private openModal(step: number) {
    let contentRef: TemplateRef<unknown> = this.stepOneRef();
    if (step === 2) {
      contentRef = this.stepTwoRef();
    }

    const templatePortal = new TemplatePortal(contentRef, this.viewContainerRef);
    this.overlayRef.attach(templatePortal);
  }
}
