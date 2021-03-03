import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { SupplierComponent } from './supplier.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierComponent
  },
  {
    path: 'create',
    component: SupplierFormComponent
  },
  {
    path: ':id/edit',
    component: SupplierFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
