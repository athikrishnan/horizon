import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseComponent } from './purchase.component';
import { PurchaseViewComponent } from './purchase-view/purchase-view.component';
import { NewPurchaseComponent } from './new-purchase/new-purchase.component';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchaseItemComponent } from './purchase-item/purchase-item.component';
import { PurchaseItemFormComponent } from './purchase-item-form/purchase-item-form.component';
import { PurchaseStateService } from './purchase-state.service';
import { AppPipeModule } from 'src/app/pipes/app-pipe.module';
import { ProductSerchModule } from 'src/app/components/product-search/product-search.module';

@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseViewComponent,
    NewPurchaseComponent,
    PurchaseItemComponent,
    PurchaseItemFormComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppPipeModule,
    ProductSerchModule
  ],
  providers: [
    PurchaseStateService
  ]
})
export class PurchaseModule { }
