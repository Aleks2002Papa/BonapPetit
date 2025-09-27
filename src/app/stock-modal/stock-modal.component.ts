import { Component, ElementRef, ViewChild, Inject, PLATFORM_ID, Output, EventEmitter, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiCallsService } from '../services/api-calls.service';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-stock-modal',
  standalone: false,
  templateUrl: './stock-modal.component.html',
  styleUrl: './stock-modal.component.css'
})
export class StockModalComponent {
  @ViewChild('myModal') myModal!: ElementRef;
  @Output() formSubmitted = new EventEmitter<any>();

  private bsModal: any;

  myForm!: FormGroup;

  salesList = signal<any[]>([])

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private apiCallService: ApiCallsService) {
    this.myForm = this.fb.group({
      id: undefined,
      quantity: [undefined , [Validators.required]],
      sales: undefined,
      date: new Date()
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
    this.myForm.controls['id']?.setValue(data.id);
    this.myForm.controls['quantity']?.setValue(data.quantity);
    this.myForm.controls['price']?.setValue(data.price);
    this.myForm.controls['status']?.setValue(data.status);
    this.myForm.controls['date']?.setValue(new Date(data.date.date));
  }

  close() {
    this.myForm.reset();
    if (this.bsModal) {
      this.bsModal.hide();
    }
  }
}
