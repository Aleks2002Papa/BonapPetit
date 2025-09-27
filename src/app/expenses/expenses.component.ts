import { Component, computed, signal } from '@angular/core';
import { ApiCallsService } from '../services/api-calls.service';
import { Router } from '@angular/router';
import { catchError, finalize, of, take, tap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-expenses',
  standalone: false,
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
  expenses = signal<any[]>([]);

  searchText = signal('');
  sortColumn = signal<keyof any | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  readonly filteredExpanses = computed(() => {
    let list = this.expenses();

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


  constructor(private apiCallService: ApiCallsService, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getExpenses()?.subscribe();
  }

  getExpenses() {
    this.spinner.show();

    return this.apiCallService.getExpenses().pipe(
      take(1),
      tap(res => {
        if (!res) {
          this.toastr?.error?.('Nuk u morën shpenzimet!');
          return;
        }
        this.expenses.set(res);
      }),
      catchError(err => {
        this.toastr?.error?.('Ndodhi një gabim gjatë marrjes së shpenzimeve!');
        return of(null);
      }),
      finalize(() => this.spinner.hide())
    );
  }

  sortBy(column: keyof any) {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  viewExpense(expanse: any) {
    this.router.navigate([`expenses/view/${expanse.id}`]);
  }

  editExpense(expanse: any) {
    this.router.navigate([`expenses/edit/${expanse.id}`]);
  }

  deleteExpense(expanse: any) {
    this.spinner.show();
    this.apiCallService.deleteExpanse(expanse.id)
      .pipe(
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (res) => {
          this.toastr.success('Shpenzimi u fshi me sukses');
          this.getExpenses()?.subscribe();
        },
        error: (err) => {
          this.toastr.error('Ndodhi një gabim gjatë fshirjes së shpenzimit!');
        }
      });

  }

  addExpense() {
    this.router.navigate(['expenses/add']);
  }
}
