import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeFinderComponent } from './income-finder/income-finder.component';
import { IncomeFormComponent } from './income-form/income-form.component';
import { IncomeComponent } from './income.component';

const routes: Routes = [
  {
    path: '',
    component: IncomeComponent
  },
  {
    path: 'create',
    component: IncomeFormComponent
  },
  {
    path: ':incomeId/edit',
    component: IncomeFormComponent
  },
  {
    path: 'finder',
    component: IncomeFinderComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeRoutingModule { }
