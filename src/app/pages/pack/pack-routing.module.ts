import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackFormComponent } from './pack-form/pack-form.component';
import { PackComponent } from './pack.component';

const routes: Routes = [
  {
    path: '',
    component: PackComponent
  },
  {
    path: 'create',
    component: PackFormComponent
  },
  {
    path: ':id/edit',
    component: PackFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackRoutingModule { }
