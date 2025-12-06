import { InjectionToken } from '@angular/core';

export interface ConfirmationModalModel {
  confirmLabel?: string;
  confirmLabel2?: string;
  confirmColor?: 'danger' | 'warning' | 'info' | 'success';

  cancelLabel?: string;
  cancelColor?: 'danger' | 'warning' | 'info' | 'success';

  icon?: 'danger' | 'warning' | 'info' | 'success';

  header: string;
  message: string;
  linkedText?: string;
  linkedUrl?: string;
  linkedTextDescription?: string;
}

export const CONFIRMATION_MODAL_DATA = new InjectionToken<ConfirmationModalModel>('CONFIRMATION_MODAL_DATA');

export const COMPONENT_MODAL_DATA = new InjectionToken<any>('COMPONENT_MODAL_DATA');
