import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleReturnComponent } from './sale-return.component';
import { SaleReturnViewComponent } from './sale-return-view/sale-return-view.component';
import { NewSaleReturnComponent } from './new-sale-return/new-sale-return.component';
import { SaleReturnRoutingModule } from './sale-return-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaleReturnItemComponent } from './sale-return-item/sale-return-item.component';
import { SaleReturnItemFormComponent } from './sale-return-item-form/sale-return-item-form.component';
import { AppPipeModule } from 'src/app/pipes/app-pipe.module';
import { ProductSerchModule } from 'src/app/components/product-search/product-search.module';
import { StateChangedService } from 'src/app/services/state-changed.service';

@NgModule({
  declarations: [
    SaleReturnComponent,
    SaleReturnViewComponent,
    NewSaleReturnComponent,
    SaleReturnItemComponent,
    SaleReturnItemFormComponent
  ],
  imports: [
    CommonModule,
    SaleReturnRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppPipeModule,
    ProductSerchModule
  ],
  providers: [
    StateChangedService
  ]
})
export class SaleReturnModule { }
