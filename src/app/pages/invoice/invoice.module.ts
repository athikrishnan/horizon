import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './invoice.component';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';

@NgModule({
  declarations: [InvoiceComponent, NewInvoiceComponent, InvoiceViewComponent, TimeAgoPipe],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InvoiceModule { }
