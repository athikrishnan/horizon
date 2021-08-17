import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPickerComponent } from './product-picker.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [ProductPickerComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonToggleModule
  ],
  exports: [ProductPickerComponent]
})

export class ProductPickerModule { }
