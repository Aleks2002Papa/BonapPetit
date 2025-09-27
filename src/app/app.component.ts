import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from './services/spinner.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bonappetit';

  loading: Observable<boolean>;

  constructor(private spinnerService: SpinnerService,public toastr: ToastrService) {
    this.loading = this.spinnerService.loading$;
  }
}
