import { Component, Inject } from '@angular/core';
import { ModalRef } from '../../interfaces/modal.ref';
import { CONFIRMATION_MODAL_DATA, ConfirmationModalModel } from '../../interfaces/confirmation-modal.model';

@Component({
  selector: 'app-confiration-modal',
  standalone: false,
  templateUrl: './confiration-modal.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      h1 {
        margin: 0;
        padding: 1em;
      }

      img {
        width: 100%;
        max-width: 500px;
        height: auto;
      }

      .overlay-content {
        padding: 1em;
      }

    `,
  ],
  styleUrls: ['./confiration-modal.component.css']
})
export class ConfirationModalComponent {
  constructor(
    public modalRef: ModalRef,
    @Inject(CONFIRMATION_MODAL_DATA)
    public modalModel: ConfirmationModalModel,
  ) { }

  confirm() {
    this.modalRef.close({
      type: 'close',
      data: true,
    });
  }
  confirmlabel2() {
    this.modalRef.close({
      type: 'close',
      data: this.modalModel.confirmLabel2,
    });
  }

  cancel() {
    this.modalRef.close({
      type: 'close',
      data: false,
    });
  }

  setButtonClasses(color: 'danger' | 'warning' | 'info' | 'success' | undefined) {
    switch (color) {
      case 'danger':
        return 'border-transparent bg-deval_danger-600 text-white hover:bg-deval_danger-100 hover:text-black focus:ring-deval_danger-500';
      case 'success':
        return 'border-transparent bg-deval_success-600 text-white hover:bg-deval_success-100 hover:text-black focus:ring-deval_success-500';
      case 'warning':
        return 'border-transparent bg-deval_warning-600 text-white hover:bg-deval_warning-100 hover:text-black focus:ring-yellow-500';
      case 'info':
        return 'border-transparent bg-deval_default-600 text-white hover:bg-deval_default-100 hover:text-black focus:ring-deval_default-500';
      default:
        return 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-black focus:ring-indigo-500';
    }
  }
  openLink() {
    const parts = this.modalModel?.linkedUrl!.split('/');
    const no = parts.pop();
    const path = parts.join('/');
    // this.sharedService.openUrlNewWindow(path, no);
  }
}
