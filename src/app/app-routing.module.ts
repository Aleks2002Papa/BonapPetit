import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SaleComponent } from './sale/sale.component';
import { CategoryComponent } from './category/category.component';
import { ProductsComponent } from './products/products.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ReportsComponent } from './reports/reports.component';
import { CategoryActionComponent } from './category-action/category-action.component';
import { SaleActionComponent } from './sale-action/sale-action.component';
import { StockComponent } from './stock/stock.component';
import { ProductActionComponent } from './product-action/product-action.component';
import { ExpensesActionComponent } from './expenses-action/expenses-action.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sales', component: SaleComponent },
  { path: 'sales/add', component: SaleActionComponent },
  { path: 'sales/view/:id', component: SaleActionComponent },
  { path: 'sales/edit/:id', component: SaleActionComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'category/add', component: CategoryActionComponent },
  { path: 'category/view/:id', component: CategoryActionComponent },
  { path: 'category/edit/:id', component: CategoryActionComponent },
  { path: 'stock', component: StockComponent },
  { path: 'stock/view/:id', component: StockComponent },
  { path: 'stock/edit/:id', component: StockComponent },
  { path: 'stock/add', component: StockComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'expenses/add', component: ExpensesActionComponent },
  { path: 'expenses/edit/:id', component: ExpensesActionComponent },
  { path: 'expenses/view/:id', component: ExpensesActionComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/add', component: ProductActionComponent },
  { path: 'products/edit/:id', component: ProductActionComponent },
  { path: 'products/view/:id', component: ProductActionComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
