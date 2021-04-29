import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeComponent } from './income.component';
import { IncomeFormComponent } from './income-form/income-form.component';
import { IncomeRoutingModule } from './income-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CurrencyInputModule } from 'src/app/components/currency-input/currency-input.module';

@NgModule({
  declarations: [
    IncomeComponent, IncomeFormComponent
  ],
  imports: [
    CommonModule,
    IncomeRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CurrencyInputModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class IncomeModule { }
