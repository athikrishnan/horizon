import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './stock.component';
import { StockRoutingModule } from './stock-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { StockQuickUpdateComponent } from './stock-quick-update/stock-quick-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StockComponent, StockQuickUpdateComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StockModule { }
