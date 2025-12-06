import { ConfirmationModalModel } from './confirmation-modal.model';

export interface ConfirmationModalConfig {
  panelClass?: string[];
  backdrop?: {
    hasBackdrop: boolean;
    class?: string;
    clickOutsideToClose: boolean;
  };
  data?: ConfirmationModalModel;
}
