import { Component, computed, input, OnInit, signal } from '@angular/core';
import { ApiCallsService } from '../services/api-calls.service';
import { catchError, EMPTY, filter, finalize, of, switchMap, take, tap } from 'rxjs';
import { Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalService } from '../services/confirmation-modal.service';


@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})

export class CategoryComponent implements OnInit {
  categories = signal<any[]>([]);

  searchText = signal('');
  sortColumn = signal<keyof any | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  readonly filteredCategories = computed(() => {
    let list = this.categories();

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


  constructor(
    private apiCallService: ApiCallsService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private confirmationModal: ConfirmationModalService,
  ) { }

  ngOnInit(): void {
    this.getCategories()?.subscribe();
  }

  getCategories() {
    this.spinner.show();

    return this.apiCallService.getCategories().pipe(
      take(1),
      tap(res => {
        if (!res) {
          this.toastr?.error?.('Nuk u morën kategoritë!');
          return;
        }
        this.categories.set(res);
      }),
      catchError(err => {
        console.error('getCategories error:', err);
        this.toastr?.error?.('Ndodhi një gabim gjatë marrjes së kategorive!');
        return of(null); // return a safe fallback
      }),
      finalize(() => this.spinner.hide()) // always hide spinner
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

  viewCategory(category: any) {
    this.router.navigate([`category/view/${category.id}`]);
  }

  editCategory(category: any) {
    this.router.navigate([`category/edit/${category.id}`]);
  }

  confirmDeleteCategory(category: any) {
    const dialog = this.confirmationModal.open({
      backdrop: {
        hasBackdrop: true,
        clickOutsideToClose: true,
      },
      data: {
        header: 'Konfirmo Fshirjen!',
        message: 'Jeni të sigurt që dëshironi të fshini këtë kategori?',
        confirmLabel: 'Fshi Kategorinë',
        cancelLabel: 'Anulo',
        confirmColor: 'danger',
        icon: 'danger',
      },
    });
    dialog.afterClosed$
      .pipe(
        filter(res => res.data === true),
        switchMap(() => this.deleteCategory(category)),
      )
      .subscribe();
  }

  deleteCategory(category: any) {
    this.spinner.show();

    return this.apiCallService.deleteCategory(category.id).pipe(
      tap(() => this.toastr.success('Kategoria u fshi me sukses!')),
      switchMap(() => this.getCategories() ?? EMPTY),
      catchError((error) => {
        console.error('deleteCategory error:', error);
        this.toastr.error('Ndodhi një gabim gjatë fshirjes së kategorisë!');
        return EMPTY;
      }),
      finalize(() => this.spinner.hide())
    )
  }

  addCategory() {
    this.router.navigate(['category/add']);
  }
}
