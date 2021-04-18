import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseViewComponent } from './purchase-view/purchase-view.component';
import { PurchaseComponent } from './purchase.component';
import { NewPurchaseComponent } from './new-purchase/new-purchase.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseComponent
  },
  {
    path: 'new-purchase',
    component: NewPurchaseComponent
  },
  {
    path: ':purchaseId/view',
    component: PurchaseViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
