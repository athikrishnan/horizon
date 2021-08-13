import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './stock.component';
import { StockRoutingModule } from './stock-routing.module';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [StockComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    MaterialModule
  ]
})
export class StockModule { }
