import { Component, signal, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudModeEnum } from '../enums/crudModeEnum';
import { ApiCallsService } from '../services/api-calls.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { StockModalComponent } from '../stock-modal/stock-modal.component';
import { SaleModalComponent } from '../sale-modal/sale-modal.component';
import { SpinnerService } from '../services/spinner.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { finalize, identity } from 'rxjs';

@Component({
  selector: 'app-product-action',
  standalone: false,
  templateUrl: './product-action.component.html',
  styleUrl: './product-action.component.css'
})
export class ProductActionComponent {
  @ViewChild('stockModal') stockModalComponent!: StockModalComponent;
  @ViewChild('saleModal') SaleModalComponent!: SaleModalComponent;

  myForm: FormGroup;

  crudMode!: CrudModeEnum;

  CrudModeEnum = CrudModeEnum;

  productId = signal<any>(undefined);

  product: any;

  categories = signal<any[]>([])

  stockIndex: number | undefined;

  saleIndex: number | undefined;

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
      id: [''],
      name: ['',[Validators.required]],
      description: [''],
      price: ['',[Validators.required]],
      stocks: this.fb.array([]),
      category_id: [undefined]
    });
  }

  get stocks(): FormArray {
    return this.myForm.get('stocks') as FormArray;
  }

  ngOnInit(): void {
    this.getCategories();
    this.productId.set(this.route.snapshot.paramMap.get('id') ?? undefined);
    let mode = this.route.snapshot.routeConfig?.path?.split('/')[1];
    this.crudMode = mode === 'add' ? CrudModeEnum.Add : mode === 'edit' ? CrudModeEnum.Edit : CrudModeEnum.View;
    if (this.productId() && (this.crudMode === CrudModeEnum.Edit || this.crudMode === CrudModeEnum.View)) {
      this.getProductById();
    }
    if (this.crudMode === CrudModeEnum.View) this.myForm.disable();
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.spinner.show();
      if (this.crudMode === CrudModeEnum.Add)
        this.apiCallsService.createProduct(this.myForm.value).subscribe(res => {
          if (!res) {
            this.spinner.hide();
            this.toastr.error('Ndodhi nje problem!');
            return;
          };
          this.spinner.hide();
          this.toastr.success('Veprimi u krye me sukses!');
          this.router.navigate(['products']);
        });
      if (this.crudMode === CrudModeEnum.Edit)
        this.apiCallsService.updateProduct(this.myForm.controls['id'].value, this.myForm.getRawValue()).subscribe(res => {
          if (!res) {
            this.spinner.hide();
            this.toastr.error('Ndodhi nje problem!');
            return;
          };
          this.spinner.hide();
          this.toastr.success('Veprimi u krye me sukses!');
          this.router.navigate(['products']);
        })
    }
  }

  handleSaleModalSubmitted($event: any, saleIndex?: number) {
    $event.stock_id = this.stocks.controls[this.stockIndex!].get('id')?.value;
    if (!$event.id) {
      this.spinner.show()
      this.apiCallsService.createSale($event).subscribe({
        next: (res) => {
          if (!res) {
            this.spinner.hide();
            this.toastr.error('Ndodhi një problem!');
            return;
          }
          this.spinner.hide();
          this.toastr.success('Veprimi u krye me sukses!');
          this.addSaleToStock(this.stockIndex!, res);
          this.getProductById();
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error(err.error.error);
        },
      });
    }
    if (this.crudMode === CrudModeEnum.Edit && this.saleIndex !== undefined) {
      this.spinner.show()
      this.apiCallsService.updateSale($event.id, $event).subscribe({
        next: (res) => {
          if (!res) {
            this.spinner.hide();
            this.toastr.error('Ndodhi një problem!');
            return;
          }
          this.spinner.hide();
          this.toastr.success('Veprimi u krye me sukses');
          this.updateSaleInStock(this.stockIndex!, this.saleIndex!, res);
          this.getProductById();
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error('Gabim gjatë përditësimit të shitjes!');
        }
      });
    }

  }

  handleStockModalSubmitted($event: any, stockIndex?: number) {
    $event.product_id = this.myForm.controls['id'].value;
    if (!$event.id) {
      // CREATE
      this.spinner.show();
      this.apiCallsService.createStock($event)
        .pipe(
          finalize(() => this.spinner.hide())   // always hide spinner
        )
        .subscribe({
          next: (res) => {
            if (!res) {
              this.toastr.error('Ndodhi një problem!');
              return;
            }
            this.toastr.success('Veprimi u krye me sukses!');
            this.stocks.push(this.createStockGroup(res));
            this.getProductById();
          },
          error: (err) => {
            this.toastr.error('Gabim gjatë krijimit të stokut!');
          }
        });

    } else if ($event.id && this.crudMode === CrudModeEnum.Edit) {
      // UPDATE
      this.spinner.show();
      this.apiCallsService.updateStock($event.id, $event)
        .pipe(
          finalize(() => this.spinner.hide())
        )
        .subscribe({
          next: (res) => {
            if (!res) {
              this.toastr.error('Ndodhi një problem!');
              return;
            }
            this.toastr.success('Veprimi u krye me sukses!');
            this.updateStock(stockIndex!, res);
            this.getProductById();

          },
          error: (err) => {
            this.toastr.error('Gabim gjatë përditësimit të stokut!');
          }
        });
    }

  }

  getSales(stockIndex: number): FormArray {
    return this.stocks.at(stockIndex).get('sales') as FormArray;
  }


  addSaleToStock(stockIndex: number, sale: any) {
    this.getSales(stockIndex).push(this.createSaleGroup(sale));
  }

  createStockGroup(stock: any): FormGroup {
    return this.fb.group({
      id: [stock?.id ?? undefined],
      date: [stock?.date ?? undefined],
      quantity: [stock?.quantity ?? undefined],
      productId: [stock?.product_id ?? undefined],
      sales: this.fb.array([])
    });
  }

  createSaleGroup(sale: any): FormGroup {
    return this.fb.group({
      id: [sale?.id ?? undefined],
      quantity: [sale?.quantity ?? undefined],
      date: [sale?.date ?? undefined],
      price: [sale?.price ?? undefined],
      status: [sale?.status ?? undefined],
    });
  }

  updateSaleInStock(stockIndex: number, saleIndex: number, updatedSale: any): void {
    const sales = this.getSales(stockIndex);
    if (sales && sales.at(saleIndex)) {
      sales.at(saleIndex).patchValue({
        id: updatedSale.id ?? null,
        quantity: updatedSale.quantity ?? null,
        date: updatedSale.date ?? null,
        price: updatedSale.price ?? null,
        status: updatedSale.status ?? null
      });
    }
  }

  updateStock(stockIndex: number, updateStock: any): void {
    const stocks = this.stocks;
    if (stocks && stocks.at(stockIndex)) {
      stocks.at(stockIndex).patchValue({
        id: updateStock.id ?? null,
        quantity: updateStock.quantity ?? null,
        date: updateStock.date ?? null,
        sales: updateStock.sales ?? null,
      });
    }
  }

  getProductById() {
    this.spinner.show();
    return this.apiCallsService
      .getProductById(this.productId())
      .pipe(
        finalize(() => this.spinner.hide()) // always hide spinner, success or error
      )
      .subscribe({
        next: (res) => {
          if (!res) {
            this.toastr?.error?.('Produkti nuk u gjet!');
            return;
          }
          this.product = res;
          this.formFill(res);
        },
        error: (err) => {
          this.toastr?.error?.('Ndodhi një gabim gjatë marrjes së produktit!');
        },
      });
  }

  getCategories() {
    this.spinner.show();
    return this.apiCallsService.getCategories()
      .pipe(
        finalize(() => this.spinner.hide()) // always hide spinner, success or error
      )
      .subscribe({
        next: (res) => {
          if (!res) {
            this.toastr?.error?.('Nuk u morën kategoritë!');
            return;
          }
          this.categories.set(res);
        },
        error: (err) => {
          this.toastr?.error?.('Ndodhi një gabim gjatë marrjes së kategorive!');
        }
      });

  }

  editSection(section: any) {
    this.stockModalComponent.open(section.getRawValue()).then(res => {
      this.getProductById();
    });
  }

  deleteSection(stock: any, index: any) {
    this.spinner.show();
    this.apiCallsService.deleteStock(stock.id)
      .pipe(
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: () => {
          this.toastr.success('Veprimi u krye me sukses!');
          this.getProductById();
        },
        error: (err) => {
          this.toastr.error('Ndodhi një gabim gjatë fshirjes së seksionit!');
        }
      });
  }

  addStock() {
    this.stockModalComponent.open();
  }

  editSale(stockIndex: number, saleIndex: number) {
    this.saleIndex = saleIndex;
    this.SaleModalComponent.open(this.getSales(stockIndex).controls[saleIndex].value);
  }

  deleteSale(sale: any, stockIndex: number, saleIndex: number) {
    this.spinner.show();
    this.apiCallsService
      .deleteSale(sale.id, this.product.stocks[stockIndex].id)
      .pipe(
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: () => {
          this.toastr.success('Veprimi u krye me sukses!');
          this.getProductById();
        },
        error: (err) => {
          this.toastr.error('Ndodhi një gabim gjatë fshirjes së shitjes!');
        }
      });


  }

  addSale() {
    this.SaleModalComponent.open({ price: this.product.price });
  }

  formFill(data: any) {
    this.myForm.controls['id']?.setValue(data.id);
    this.myForm.controls['name']?.setValue(data.name);
    this.myForm.controls['description']?.setValue(data.description);
    this.myForm.controls['price']?.setValue(data.price);
    this.myForm.controls['category_id']?.setValue(data.category?.id ?? null);

    this.stocks.clear();
    if (data && data.stocks) {
      data.stocks?.forEach((stock: any) => {
        const stockGroup = this.fb.group({
          id: [stock?.id ?? undefined],
          date: [stock?.date ?? undefined],
          quantity: [stock?.quantity ?? undefined],
          productId: [stock?.product_id ?? undefined],
          sales: this.fb.array([])
        });

        const salesArray = stockGroup.get('sales') as FormArray;

        stock.sales?.forEach((sale: any) => {
          salesArray.push(this.createSaleGroup(sale));
        });

        this.stocks.push(stockGroup);
      });
    }

  }

  goBack() {
    this.location.back();
  }
}

