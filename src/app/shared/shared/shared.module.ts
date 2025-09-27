import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../table/table.component';
import { FormsModule } from '@angular/forms';
import { NgxTippyModule } from 'ngx-tippy-wrapper';


@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxTippyModule

  ],
  exports:[TableComponent,FormsModule]
})
export class SharedModule { }
