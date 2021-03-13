import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductVariantFormComponent } from './product-variant-form/product-variant-form.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { ProductComponent } from './product.component';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent
  },
  {
    path: 'create',
    component: ProductFormComponent
  },
  {
    path: ':id/view',
    component: ProductViewComponent
  },
  {
    path: ':id/edit',
    component: ProductFormComponent
  },
  {
    path: ':productId/variant/create',
    component: ProductVariantFormComponent
  },
  {
    path: ':productId/variant/:variantId/edit',
    component: ProductVariantFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
