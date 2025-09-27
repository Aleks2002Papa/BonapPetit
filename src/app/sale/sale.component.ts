import { Component, computed, signal } from '@angular/core';
import { ApiCallsService } from '../services/api-calls.service';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sale',
  standalone: false,
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {
  sales = signal<any[]>([]);

  searchText = signal('');
  sortColumn = signal<keyof any | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  readonly filteredSales = computed(() => {
    let list = this.sales();

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


  constructor(private apiCallService: ApiCallsService, private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getSales()?.subscribe();
  }

  getSales() {
    this.spinner.show();
    return this.apiCallService.getSales().pipe(
      take(1),
      tap(res => {
        if (!res) { this.spinner.hide(); return };
        this.sales.set(res);
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

  viewSale(sale: any) {
    this.router.navigate([`sales/view/${sale.id}`]);
  }

  editSale(sale: any) {
    this.router.navigate([`sales/edit/${sale.id}`]);
  }

  deleteSale(sale: any) {
    if (confirm(`Delete ${sale.name}?`)) {
      const current = this.sales();
      const updated = current.filter((u: { id: number; }) => u.id !== sale.id);
      this.sales.set(updated); // Parent should pass a writable signal!
    }
  }

  addSale() {
    this.router.navigate(['sales/add']);
  }
}
