import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerDiscountComponent } from './customer-discount/customer-discount.component';
import { CurrencyInputModule } from 'src/app/components/currency-input/currency-input.module';

@NgModule({
  declarations: [
    CustomerComponent,
    CustomerFormComponent,
    CustomerViewComponent,
    CustomerDiscountComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyInputModule
  ],
  entryComponents: [
    CustomerDiscountComponent
  ]
})
export class CustomerModule { }
