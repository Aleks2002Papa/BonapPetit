import { Subject } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';

export interface ModalCloseEvent<R> {
  type: 'backdropClick' | 'close';
  data?: R;
}

export class ModalRef {
  afterClosed$ = new Subject<ModalCloseEvent<any>>();

  constructor(private overlayRef: OverlayRef) {}

  close(result: ModalCloseEvent<any>): void {
    this._close(result);
  }

  private _close(event: ModalCloseEvent<any>) {
    this.overlayRef.dispose();
    this.afterClosed$.next(event);
    this.afterClosed$.complete();
  }
}
