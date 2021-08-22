import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteComponent } from './quote.component';
import { QuoteItemComponent } from './quote-item/quote-item.component';
import { QuoteItemFormComponent } from './quote-item-form/quote-item-form.component';
import { QuotePrintComponent } from './quote-print/quote-print.component';
import { QuoteViewComponent } from './quote-view/quote-view.component';
import { NewQuoteComponent } from './new-quote/new-quote.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuoteRoutingModule } from './quote-routing.module';
import { AppPipeModule } from 'src/app/pipes/app-pipe.module';
import { QuotePrintService } from './quote-print.service';
import { AmountInWordsService } from 'src/app/services/amount-in-words.service';
import { StateChangedService } from 'src/app/services/state-changed.service';
import { CurrencyInputModule } from 'src/app/components/currency-input/currency-input.module';
import { ProductPickerModule } from 'src/app/components/product-picker/product-picker.module';

@NgModule({
  declarations: [
    QuoteComponent,
    QuoteItemComponent,
    QuoteItemFormComponent,
    QuotePrintComponent,
    QuoteViewComponent,
    NewQuoteComponent
  ],
  imports: [
    CommonModule,
    QuoteRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppPipeModule,
    CurrencyInputModule,
    ProductPickerModule
  ],
  providers: [
    AmountInWordsService,
    StateChangedService,
    QuotePrintService
  ]
})
export class QuoteModule { }
