import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleReturnViewComponent } from './sale-return-view/sale-return-view.component';
import { SaleReturnComponent } from './sale-return.component';
import { NewSaleReturnComponent } from './new-sale-return/new-sale-return.component';

const routes: Routes = [
  {
    path: '',
    component: SaleReturnComponent
  },
  {
    path: 'new-sale-return',
    component: NewSaleReturnComponent
  },
  {
    path: ':saleReturnId/view',
    component: SaleReturnViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleReturnRoutingModule { }
