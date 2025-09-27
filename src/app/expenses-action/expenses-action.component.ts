import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudModeEnum } from '../enums/crudModeEnum';
import { ApiCallsService } from '../services/api-calls.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-expenses-action',
  standalone: false,
  templateUrl: './expenses-action.component.html',
  styleUrl: './expenses-action.component.css'
})
export class ExpensesActionComponent {
  myForm: FormGroup;

  crudMode!: CrudModeEnum;

  CrudModeEnum = CrudModeEnum;

  expanseId = signal<any>(undefined);

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
      name: [undefined,[Validators.required]],
      description: undefined,
      amount: [undefined,[Validators.required]],
      date: new Date(),
    });
  }
  ngOnInit(): void {
    this.expanseId.set(this.route.snapshot.paramMap.get('id') ?? undefined);
    let mode = this.route.snapshot.routeConfig?.path?.split('/')[1];
    this.crudMode = mode === 'add' ? CrudModeEnum.Add : mode === 'edit' ? CrudModeEnum.Edit : CrudModeEnum.View;
    if (this.expanseId() && (this.crudMode === CrudModeEnum.Edit || this.crudMode === CrudModeEnum.View)) {
      this.getExpanseById();
    }
    if (this.crudMode === CrudModeEnum.View) this.myForm.disable();
  }

  onSubmit() {
    if (!this.myForm.valid) return;

    this.spinner.show();

    let request$;

    if (this.crudMode === CrudModeEnum.Add) {
      request$ = this.apiCallsService.createExpanse(this.myForm.value);
    } else if (this.crudMode === CrudModeEnum.Edit) {
      request$ = this.apiCallsService.updateExpanse(
        this.myForm.controls['id'].value,
        this.myForm.getRawValue()
      );
    } else {
      this.spinner.hide();
      return;
    }

    request$
      .pipe(finalize(() => this.spinner.hide())) // always hide spinner
      .subscribe({
        next: (res) => {
          if (!res) {
            this.toastr.error('Ndodhi një problem!');
            return;
          }
          this.toastr.success('Veprimi u krye me sukses!');
          this.router.navigate(['expenses']);
        },
        error: (err) => {
          console.error('Expanse save error:', err);
          this.toastr.error('Ndodhi një gabim gjatë ruajtjes së shpenzimit!');
        }
      });
  }


  getExpanseById() {
    this.spinner.show();
    return this.apiCallsService.getExpanseById(this.expanseId())
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (res) => {
          if (!res) {
            this.toastr.error('Ndodhi një problem gjatë marrjes së shpenzimit!');
            return;
          }
          this.formFill(res);
        },
        error: (err) => {
          console.error('getExpanseById error:', err);
          this.toastr.error('Ndodhi një gabim gjatë marrjes së shpenzimit!');
        }
      });
  }


  formFill(data: any) {
    this.myForm.controls['id'].setValue(data.id);
    this.myForm.controls['name'].setValue(data.name);
    this.myForm.controls['description'].setValue(data.description);
    this.myForm.controls['amount'].setValue(data.amount);
    this.myForm.controls['date'].setValue(new Date(data.date.date));
  }

  goBack() {
    this.location.back();
  }
}
