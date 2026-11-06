import { Injectable, signal } from '@angular/core';
import { PaymentMethodId } from '../data/checkout.mock';

export type CheckoutStep = 1 | 2 | 3 | 4;
export type PaymentState = 'ready' | 'processing' | 'success' | 'error';
export type ForcedPaymentResult = Exclude<PaymentState, 'ready'> | 'ready' | null;

export interface CheckoutDraft {
  documentId: string;
  fullName: string;
  whatsapp: string;
  email: string;
  city: string;
  address: string;
}

const emptyDraft: CheckoutDraft = {
  documentId: '',
  fullName: '',
  whatsapp: '',
  email: '',
  city: '',
  address: ''
};

@Injectable({ providedIn: 'root' })
export class CheckoutStateService {
  readonly draft = signal<CheckoutDraft>({ ...emptyDraft });
  readonly activeStep = signal<CheckoutStep>(1);
  readonly completedSteps = signal<CheckoutStep[]>([]);
  readonly paymentMethod = signal<PaymentMethodId | null>(null);
  readonly paymentState = signal<PaymentState>('ready');
  readonly forcedPaymentResult = signal<ForcedPaymentResult>(null);
  readonly orderNumber = signal<string | null>(null);

  updateDraft(draft: CheckoutDraft): void {
    this.draft.set({ ...draft });
  }

  completeStep(step: CheckoutStep): void {
    if (step > 1 && !this.completedSteps().includes((step - 1) as CheckoutStep)) return;
    this.completedSteps.update(steps => steps.includes(step) ? steps : [...steps, step]);
    this.activeStep.set(Math.min(step + 1, 4) as CheckoutStep);
  }

  editStep(step: CheckoutStep): void {
    this.activeStep.set(step);
    this.completedSteps.update(steps => steps.filter(completedStep => completedStep < step));
    this.paymentState.set('ready');
    this.orderNumber.set(null);
  }

  invalidateStepsFrom(step: CheckoutStep): void {
    this.completedSteps.update(steps => steps.filter(completedStep => completedStep < step));
    this.activeStep.set(step);
    this.paymentState.set('ready');
    this.orderNumber.set(null);
  }

  invalidateStepsAfter(step: CheckoutStep): void {
    this.completedSteps.update(steps => steps.filter(completedStep => completedStep <= step));
    this.paymentState.set('ready');
    this.orderNumber.set(null);
  }

}