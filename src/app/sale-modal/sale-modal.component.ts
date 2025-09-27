import { Component, ElementRef, EventEmitter, Inject, Output, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCallsService } from '../services/api-calls.service';
import { isPlatformBrowser } from '@angular/common';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-sale-modal',
  standalone: false,
  templateUrl: './sale-modal.component.html',
  styleUrl: './sale-modal.component.css'
})
export class SaleModalComponent {
  @ViewChild('myModal') myModal!: ElementRef;
  @Output() formSubmitted = new EventEmitter<any>();

  private bsModal: any;

  myForm!: FormGroup;

  salesList = signal<any[]>([])

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private apiCallService: ApiCallsService) {
    this.myForm = this.fb.group({
      id: undefined,
      quantity: [undefined,[Validators.required]],
      price: [undefined , [Validators.required]],
      date: new Date(),
      status: [undefined , [Validators.required]],
    });
  }

  async open(data?: any) {
    if (data) this.formFill(data);
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = await import('bootstrap');
      this.bsModal = new bootstrap.Modal(this.myModal.nativeElement);
      this.bsModal.show();
    }
  }

  submitForm() {
    if (this.myForm.valid) {
      this.formSubmitted.emit(this.myForm.value);
      this.myForm.reset();
      this.close();
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  formFill(data: any) {
    this.myForm.controls['id']?.setValue(data?.id ?? null);
    this.myForm.controls['quantity']?.setValue(data?.quantity ?? null);
    this.myForm.controls['price']?.setValue(data?.price ?? null);
    this.myForm.controls['status']?.setValue(data?.status ?? null);
    this.myForm.controls['date']?.setValue(data?.date?.date ? new Date(data?.date?.date) : new Date());
  }

  close() {
    this.myForm.reset();
    if (this.bsModal) {
      this.bsModal.hide();
    }
  }
}
