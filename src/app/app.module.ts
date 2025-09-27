import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { CategoryComponent } from './category/category.component';
import { ProductsComponent } from './products/products.component';
import { SaleComponent } from './sale/sale.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ReportsComponent } from './reports/reports.component';
// import { SharedModule } from './shared/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { CategoryActionComponent } from './category-action/category-action.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SaleActionComponent } from './sale-action/sale-action.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { StockComponent } from './stock/stock.component';
import { StockActionComponent } from './stock-action/stock-action.component';
import { ProductActionComponent } from './product-action/product-action.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { StockModalComponent } from './stock-modal/stock-modal.component';
import { SaleModalComponent } from './sale-modal/sale-modal.component';
import { ExpensesActionComponent } from './expenses-action/expenses-action.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from 'ngx-toastr'


// ✅ Import Albanian locale
import localeSq from '@angular/common/locales/sq';
registerLocaleData(localeSq);

export const EUROPEAN_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    CategoryComponent,
    ProductsComponent,
    SaleComponent,
    ExpensesComponent,
    ReportsComponent,
    CategoryActionComponent,
    SaleActionComponent,
    StockComponent,
    StockActionComponent,
    ProductActionComponent,
    StockModalComponent,
    SaleModalComponent,
    ExpensesActionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatTooltipModule,
    // SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      positionClass: 'toast-bottom-center',
    }),
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    { provide: LOCALE_ID, useValue: 'sq' },          // ✅ Global locale
    { provide: MAT_DATE_LOCALE, useValue: 'sq-AL' }, // ✅ Material datepicker locale
    { provide: MAT_DATE_FORMATS, useValue: EUROPEAN_DATE_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
