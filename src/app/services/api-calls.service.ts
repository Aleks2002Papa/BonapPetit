import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  private categoryApi = 'http://bakery.al/api/categories';
  private salesApi = 'http://bakery.al/api/sales';
  private stocksApi = 'http://bakery.al/api/stocks';
  private productsApi = 'http://bakery.al/api/products';
  private expansesApi = 'http://bakery.al/api/expenses';

  constructor(private http: HttpClient) { }

  getExpenses(): Observable<any[]> {
    return this.http.get<any[]>(this.expansesApi);
  }

  createExpanse(expanse: any): Observable<any> {
    return this.http.post<any>(this.expansesApi + '/new', expanse);
  }

  updateExpanse(id: number, expanse: Partial<any>): Observable<any> {
    return this.http.put<any>(`${this.expansesApi}/${id}`, expanse);
  }

  deleteExpanse(expanseId: any): Observable<any> {
    return this.http.delete<any>(this.expansesApi + '/' + expanseId);
  }

  getExpanseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.expansesApi}/${id}`);
  }

  getStock(): Observable<any[]> {
    return this.http.get<any[]>(this.stocksApi);
  }

  deleteStock(stockId: any): Observable<any> {
    return this.http.delete<any>(this.stocksApi + '/' + stockId);
  }

  createStock(stock: any): Observable<any> {
    return this.http.post<any>(this.stocksApi + '/new', stock);
  }

  updateStock(id: number, stock: Partial<any>): Observable<any> {
    return this.http.put<any>(`${this.stocksApi}/${id}`, stock);
  }

  getStockById(id: number): Observable<any> {
    return this.http.get<any>(`${this.stocksApi}/${id}`);
  }

  getProduct(): Observable<any[]> {
    return this.http.get<any[]>(this.productsApi);
  }

  createProduct(stock: any): Observable<any> {
    return this.http.post<any>(this.productsApi + '/new', stock);
  }

  updateProduct(id: number, stock: Partial<any>): Observable<any> {
    return this.http.put<any>(`${this.productsApi}/${id}`, stock);
  }

  deleteProduct(stock: any): Observable<any> {
    return this.http.delete<any>(this.productsApi + '/' + stock.id);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.productsApi}/${id}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.categoryApi);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post<any>(this.categoryApi + '/new', category);
  }

  updateCategory(id: number, category: Partial<any>): Observable<any> {
    return this.http.put<any>(`${this.categoryApi}/${id}/edit`, category);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.categoryApi}/${id}`);
  }

  deleteCategory(categoryId: any): Observable<any> {
    return this.http.delete<any>(this.categoryApi + '/' + categoryId);
  }

  getSales(): Observable<any[]> {
    return this.http.get<any[]>(this.salesApi);
  }

  createSale(sale: any): Observable<any> {
    return this.http.post<any>(this.salesApi + '/new', sale);
  }

  deleteSale(saleId: any, stockId: any): Observable<any> {
    return this.http.delete<any>(this.stocksApi + '/' + stockId + '/' + 'sales/' + saleId);
  }

  updateSale(id: number, sale: Partial<any>): Observable<any> {
    return this.http.put<any>(`${this.salesApi}/${id}`, sale);
  }

  getSaleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.salesApi}/${id}`);
  }

}
