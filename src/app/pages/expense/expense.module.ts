import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseComponent } from './expense.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { ExpenseRoutingModule } from './expense-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CurrencyInputModule } from 'src/app/components/currency-input/currency-input.module';

@NgModule({
  declarations: [
    ExpenseComponent, ExpenseFormComponent
  ],
  imports: [
    CommonModule,
    ExpenseRoutingModule,
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
export class ExpenseModule { }
