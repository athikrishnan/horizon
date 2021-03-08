import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './invoice.component';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ClientSelectionComponent } from './client-selection/client-selection.component';

@NgModule({
  declarations: [InvoiceComponent, ClientSelectionComponent],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    MaterialModule
  ]
})
export class InvoiceModule { }
