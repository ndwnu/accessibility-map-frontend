import { computed, Injectable, signal } from '@angular/core';

export enum ModalEnum {
  Step1 = 'step1',
  Step2 = 'step2',
  Step3 = 'step3',
  Disclaimer = 'disclaimer',
}

const STEP_TO_MODAL: Record<number, ModalEnum> = {
  1: ModalEnum.Step1,
  2: ModalEnum.Step2,
  3: ModalEnum.Step3,
};

const MODAL_TO_STEP: Record<ModalEnum, number> = {
  [ModalEnum.Step1]: 1,
  [ModalEnum.Step2]: 2,
  [ModalEnum.Step3]: 3,
  [ModalEnum.Disclaimer]: 0,
};

@Injectable({
  providedIn: 'root',
})
export class AccessibilityModalService {
  readonly activeModal = signal<ModalEnum | null>(null);

  readonly activeStep = computed(() => {
    const modal = this.activeModal();
    if (modal === null) {
      return 0;
    }
    return MODAL_TO_STEP[modal] ?? 0;
  });

  open(modal: ModalEnum): void {
    this.activeModal.set(modal);
  }

  close(): void {
    this.activeModal.set(null);
  }

  openStep(step: number): void {
    const modal = STEP_TO_MODAL[step];
    if (modal) {
      this.open(modal);
    } else {
      this.close();
    }
  }

  nextStep(): void {
    const currentStep = this.activeStep();
    if (currentStep < 3) {
      this.openStep(currentStep + 1);
    }
  }

  previousStep(): void {
    const currentStep = this.activeStep();
    if (currentStep > 1) {
      this.openStep(currentStep - 1);
    }
  }

  openDisclaimer(): void {
    this.open(ModalEnum.Disclaimer);
  }
}
