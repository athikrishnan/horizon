import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductVariantFormComponent } from './product-variant-form/product-variant-form.component';
import { ProductStockComponent } from './product-stock/product-stock.component';
import { ProductImagesComponent } from './product-images/product-images.component';
import { ProductPickerModule } from 'src/app/components/product-picker/product-picker.module';

@NgModule({
  declarations: [
    ProductComponent,
    ProductFormComponent,
    ProductViewComponent,
    ProductVariantFormComponent,
    ProductStockComponent,
    ProductImagesComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ProductPickerModule
  ]
})
export class ProductModule { }
