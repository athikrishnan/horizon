import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductImagesComponent } from './product-images/product-images.component';
import { ProductStockComponent } from './product-stock/product-stock.component';
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
    path: ':productId/view',
    component: ProductViewComponent
  },
  {
    path: ':productId/edit',
    component: ProductFormComponent
  },
  {
    path: ':productId/stock',
    component: ProductStockComponent
  },
  {
    path: ':productId/variant/create',
    component: ProductVariantFormComponent
  },
  {
    path: ':productId/variant/:variantId/edit',
    component: ProductVariantFormComponent
  },
  {
    path: ':productId/images',
    component: ProductImagesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
