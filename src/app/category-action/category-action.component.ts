import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ApiCallsService } from '../services/api-calls.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudModeEnum } from '../enums/crudModeEnum';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-category-action',
  standalone: false,
  templateUrl: './category-action.component.html',
  styleUrl: './category-action.component.css'
})
export class CategoryActionComponent implements OnInit {
  myForm: FormGroup;

  crudMode!: CrudModeEnum

  categoryId = signal<any>(undefined);

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
      name: ['',[Validators.required]],
      description: '',
    });
  }
  ngOnInit(): void {
    this.categoryId.set(this.route.snapshot.paramMap.get('id') ?? undefined);
    let mode = this.route.snapshot.routeConfig?.path?.split('/')[1];
    this.crudMode = mode === 'add' ? CrudModeEnum.Add : mode === 'edit' ? CrudModeEnum.Edit : CrudModeEnum.View;
    if (this.categoryId() && (this.crudMode === CrudModeEnum.Edit || this.crudMode === CrudModeEnum.View)) {
      this.getCategoryById();
    }
  }

  onSubmit() {
    if (!this.myForm.valid) {
      return;
    }

    this.spinner.show();

    let request$;

    if (this.crudMode === CrudModeEnum.Add) {
      this.myForm.controls['id'].setValue(undefined);
      request$ = this.apiCallsService.createCategory(this.myForm.value);
    } else if (this.crudMode === CrudModeEnum.Edit) {
      request$ = this.apiCallsService.updateCategory(
        this.myForm.controls['id'].value,
        this.myForm.getRawValue()
      );
    } else {
      return;
    }

    request$
      .pipe(
        finalize(() => this.spinner.hide()) // always hide spinner
      )
      .subscribe({
        next: (res) => {
          if (!res) {
            this.toastr.error('Ndodhi një problem!');
            return;
          }
          this.toastr.success('Veprimi u krye me sukses!');
          this.router.navigate(['category']);
        },
        error: (err) => {
          this.toastr.error('Ndodhi një gabim gjatë ruajtjes së kategorisë!');
        }
      });
  }


  getCategoryById() {
    this.spinner.show();
    return this.apiCallsService
      .getCategoryById(this.categoryId())
      .pipe(
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (res) => {
          if (!res) {
            this.toastr.error('Ndodhi një problem');
            return;
          }
          this.formFill(res);
        },
        error: (err) => {
          this.toastr.error('Ndodhi një gabim gjatë marrjes së kategorisë!');
        },
      });
  }

  formFill(data: any) {
    this.myForm.controls['id'].setValue(data.id);
    this.myForm.controls['name'].setValue(data.name);
    this.myForm.controls['description'].setValue(data.description);
  }

  goBack() {
    this.location.back();
  }
}
