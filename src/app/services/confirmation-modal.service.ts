import { ComponentRef, Injectable, Injector } from '@angular/core';
import { ConfirmationModalConfig } from '../interfaces/confirmation-modal.config';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ModalRef } from '../interfaces/modal.ref';
import { filter } from 'rxjs';
import { ComponentPortal } from '@angular/cdk/portal';
import { CONFIRMATION_MODAL_DATA } from '../interfaces/confirmation-modal.model';
import { ConfirationModalComponent } from '../shared/confiration-modal/confiration-modal.component';


const DEFAULT_CONFIG: ConfirmationModalConfig = {
  backdrop: {
    hasBackdrop: true,
    class: 'dark-backdrop',
    clickOutsideToClose: true,
  },
  panelClass: [],
  data: undefined,
};

@Injectable()
export class ConfirmationModalService {
  constructor(
    private injector: Injector,
    private overlay: Overlay,
  ) {}

  open(config: ConfirmationModalConfig) {
    if (config.backdrop) {
      config.backdrop.class = 'is-confirmation-modal';
    }
    // Override default configuration
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };

    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.createOverlay(dialogConfig);

    // Instantiate remote control
    const dialogRef = new ModalRef(overlayRef);

    // const overlayComponent =
    this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);

    overlayRef
      .backdropClick()
      .pipe(filter(() => config.backdrop?.clickOutsideToClose ?? DEFAULT_CONFIG.backdrop?.clickOutsideToClose ?? true))
      .subscribe(() =>
        dialogRef.close({
          type: 'backdropClick',
          data: true,
        }),
      );

    return dialogRef;
  }

  private createOverlay(config: ConfirmationModalConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: ConfirmationModalConfig, dialogRef: ModalRef) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(ConfirationModalComponent, null, injector);
    const containerRef: ComponentRef<ConfirationModalComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: ConfirmationModalConfig, dialogRef: ModalRef) {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ModalRef, useValue: dialogRef },
        { provide: CONFIRMATION_MODAL_DATA, useValue: config.data },
      ],
    });
  }

  private getOverlayConfig(config: ConfirmationModalConfig): OverlayConfig {
    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    return new OverlayConfig({
      hasBackdrop: config.backdrop?.hasBackdrop ?? DEFAULT_CONFIG.backdrop?.hasBackdrop,
      backdropClass:
        (config.backdrop?.hasBackdrop ?? DEFAULT_CONFIG.backdrop?.hasBackdrop)
          ? (config.backdrop?.class ?? DEFAULT_CONFIG.backdrop?.class)
          : undefined,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });
  }
}
