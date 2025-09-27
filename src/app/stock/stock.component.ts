import { Component, computed, signal } from '@angular/core';
import { ApiCallsService } from '../services/api-calls.service';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-stock',
  standalone: false,
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent {
  stock = signal<any[]>([]);

  searchText = signal('');
  sortColumn = signal<keyof any | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  readonly filteredStock = computed(() => {
    let list = this.stock();

    const search = this.searchText().toLowerCase();
    if (search) {
      list = list.filter((user: { name: string; description: string; role: string; }) =>
        user.name.toLowerCase().includes(search) ||
        user.description.toLowerCase().includes(search)
      );
    }

    const column = this.sortColumn();
    const direction = this.sortDirection();
    if (column) {
      list = [...list].sort((a, b) => {
        const valA = a[column];
        const valB = b[column];
        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return list;
  });


  constructor(private apiCallService: ApiCallsService, private router: Router,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getStocks()?.subscribe();
  }

  getStocks() {
    this.spinner.show();
    return this.apiCallService.getStock().pipe(
      take(1),
      tap(res => {
        if (!res) {this.spinner.hide(); return};
        this.stock.set(res)
        this.spinner.hide();
      })
    )
  }

  sortBy(column: keyof any) {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  viewStock(sale: any) {
    this.router.navigate([`stock/view/${sale.id}`]);
  }

  editStock(sale: any) {
    this.router.navigate([`stock/edit/${sale.id}`]);
  }

  deleteStock(sale: any) {
    if (confirm(`Delete ${sale.id}?`)) {
      this.spinner.show();
      this.apiCallService.deleteStock(sale).subscribe(res => {
        if(!res) {this.spinner.hide(); return};
       this.getStocks().subscribe();
      })
    }
  }

  addStock() {
    this.router.navigate(['stock/add']);
  }
}
