import { Component, computed, signal } from '@angular/core';
import { ApiCallsService } from '../services/api-calls.service';
import { Router } from '@angular/router';
import { finalize, take, tap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products = signal<any[]>([]);

  searchText = signal('');
  sortColumn = signal<keyof any | ''>('');
  sortDirection = signal<'asc' | 'desc'>('desc');
  sortField = signal<string>('id');


  page = signal<number>(1);
  pageSize = signal<number>(10);

  totalPages = computed(() => {
    return Math.ceil(this.filteredStock().length / this.pageSize());
  })

  sortedStock = computed(() => {
    return this.filteredStock().slice().sort((a, b) => {
      const valueA = a[this.sortField()];
      const valueB = b[this.sortField()];

      if (valueA < valueB) return this.sortDirection() === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection() === 'asc' ? 1 : -1;
      return 0;
    });
  })

  readonly filteredStock = computed(() => {
    let list = this.products();

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


  constructor(private apiCallService: ApiCallsService, private router: Router, private spinner: NgxSpinnerService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.getProduct()?.subscribe();
  }

  getProduct() {
    this.spinner.show();
    return this.apiCallService.getProduct().pipe(
      take(1),
      tap(res => {
        if (!res) { this.spinner.hide(); return };
        this.products.set(res);
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

  viewProduct(sale: any) {
    this.router.navigate([`products/view/${sale.id}`]);
  }

  editProduct(sale: any) {
    this.router.navigate([`products/edit/${sale.id}`]);
  }

  deleteProduct(sale: any) {
    this.spinner.show();
    this.apiCallService.deleteProduct(sale)
      .pipe(
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (res) => {
          this.toastr.success('Produkti u fshi me sukses!');
          this.getProduct()?.subscribe();
        },
        error: (err) => {
          this.toastr.error('Ndodhi një gabim gjatë fshirjes së produktit!');
        }
      });
  }


  addProduct() {
    this.router.navigate(['products/add']);
  }
}
