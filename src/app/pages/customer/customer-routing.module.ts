import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerInvoiceComponent } from './customer-invoice/customer-invoice.component';
import { CustomerNewInvoiceComponent } from './customer-new-invoice/customer-new-invoice.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerComponent } from './customer.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent
  },
  {
    path: 'create',
    component: CustomerFormComponent
  },
  {
    path: ':id/view',
    component: CustomerViewComponent
  },
  {
    path: ':id/edit',
    component: CustomerFormComponent
  },
  {
    path: ':id/customer-invoice',
    component: CustomerInvoiceComponent
  },
  {
    path: ':id/customer-new-invoice',
    component: CustomerNewInvoiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
