import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProformaComponent } from './proforma.component';
import { ProformaRoutingModule } from './proforma-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { NewProformaComponent } from './new-proforma/new-proforma.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProformaViewComponent } from './proforma-view/proforma-view.component';
import { ProformaItemFormComponent } from './proforma-item-form/proforma-item-form.component';
import { ProformaItemComponent } from './proforma-item/proforma-item.component';
import { ProformaPrintComponent } from './proforma-print/proforma-print.component';
import { ProformaPrintService } from './proforma-print.service';
import { AppPipeModule } from 'src/app/pipes/app-pipe.module';
import { ProductSerchModule } from 'src/app/components/product-search/product-search.module';
import { AmountInWordsService } from 'src/app/services/amount-in-words.service';
import { StateChangedService } from 'src/app/services/state-changed.service';
import { CurrencyInputModule } from 'src/app/components/currency-input/currency-input.module';

@NgModule({
  declarations: [
    ProformaComponent,
    NewProformaComponent,
    ProformaViewComponent,
    ProformaItemFormComponent,
    ProformaItemComponent,
    ProformaPrintComponent
  ],
  imports: [
    CommonModule,
    ProformaRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppPipeModule,
    ProductSerchModule,
    CurrencyInputModule
  ],
  providers: [
    StateChangedService,
    ProformaPrintService,
    AmountInWordsService
  ]
})
export class ProformaModule { }
