import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './invoice.component';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { InvoiceItemFormComponent } from './invoice-item-form/invoice-item-form.component';
import { InvoiceItemComponent } from './invoice-item/invoice-item.component';
import { InvoicePrintComponent } from './invoice-print/invoice-print.component';
import { InvoicePrintService } from './invoice-print.service';
import { AppPipeModule } from 'src/app/pipes/app-pipe.module';
import { ProductSerchModule } from 'src/app/components/product-search/product-search.module';
import { AmountInWordsService } from 'src/app/services/amount-in-words.service';
import { StateChangedService } from 'src/app/services/state-changed.service';
import { CurrencyInputModule } from 'src/app/components/currency-input/currency-input.module';

@NgModule({
  declarations: [
    InvoiceComponent,
    NewInvoiceComponent,
    InvoiceViewComponent,
    InvoiceItemFormComponent,
    InvoiceItemComponent,
    InvoicePrintComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppPipeModule,
    ProductSerchModule,
    CurrencyInputModule
  ],
  providers: [
    StateChangedService,
    InvoicePrintService,
    AmountInWordsService
  ]
})
export class InvoiceModule { }
