import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPickerComponent } from './product-picker.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [ProductPickerComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule
  ],
  exports: [ProductPickerComponent]
})

export class ProductPickerModule { }
