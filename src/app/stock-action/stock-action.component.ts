import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudModeEnum } from '../enums/crudModeEnum';
import { ApiCallsService } from '../services/api-calls.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stock-action',
  standalone: false,
  templateUrl: './stock-action.component.html',
  styleUrl: './stock-action.component.css'
})
export class StockActionComponent {
  myForm: FormGroup;

  crudMode!: CrudModeEnum;

  CrudModeEnum = CrudModeEnum;

  stockId = signal<any>(undefined);

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private apiCallsService: ApiCallsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public toastr: ToastrService
  ) {
    this.myForm = this.fb.group({
      id: undefined,
      quantity: undefined,
      sales: undefined,
      date: undefined
    });
  }
  ngOnInit(): void {
    this.stockId.set(this.route.snapshot.paramMap.get('id') ?? undefined);
    let mode = this.route.snapshot.routeConfig?.path?.split('/')[1];
    this.crudMode = mode === 'add' ? CrudModeEnum.Add : mode === 'edit' ? CrudModeEnum.Edit : CrudModeEnum.View;
    if (this.stockId() && (this.crudMode === CrudModeEnum.Edit || this.crudMode === CrudModeEnum.View)) {
      this.getSaleById();
    }
    if (this.crudMode === CrudModeEnum.View) this.myForm.disable();
  }

  onSubmit() {
    if (this.myForm.valid) {
      if (this.crudMode === CrudModeEnum.Add) {
        this.apiCallsService.createStock(this.myForm.value).subscribe(res => {
          if (!res) {
            this.spinner.hide();
            this.toastr.error('Ndodhi nje gabim!');
            return;
          };
          this.spinner.hide();
          this.toastr.success('Veprimi u krye me sukses!');
          this.router.navigate(['stock']);
        });
      }
      if (this.crudMode === CrudModeEnum.Edit) {
        this.apiCallsService.updateStock(this.myForm.controls['id'].value, this.myForm.getRawValue()).subscribe(res => {
           if (!res) {
            this.spinner.hide();
            this.toastr.error('Ndodhi nje gabim!');
            return;
          };
          this.spinner.hide();
          this.toastr.success('Veprimi u krye me sukses!');
          this.router.navigate(['stock']);
        })
      }
    }
  }

  getSaleById() {
    this.spinner.show();
    return this.apiCallsService.getSaleById(this.stockId()).subscribe(res => {
      if (!res) { this.spinner.hide(); return };
      this.formFill(res);
      this.spinner.hide();
    })
  }

  formFill(data: any) {
    this.myForm.controls['id'].setValue(data.id);
    this.myForm.controls['quantity'].setValue(data.quantity);
    this.myForm.controls['price'].setValue(data.price);
    this.myForm.controls['status'].setValue(data.status);
    this.myForm.controls['date'].setValue(new Date(data.date.date));
  }

  goBack() {
    this.location.back();
  }
}
