import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseFinderComponent } from './expense-finder/expense-finder.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { ExpenseComponent } from './expense.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseComponent
  },
  {
    path: 'create',
    component: ExpenseFormComponent
  },
  {
    path: ':expenseId/edit',
    component: ExpenseFormComponent
  },
  {
    path: 'finder',
    component: ExpenseFinderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRoutingModule { }
