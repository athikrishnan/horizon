import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlabFormComponent } from './slab-form/slab-form.component';
import { SlabComponent } from './slab.component';

const routes: Routes = [
  {
    path: '',
    component: SlabComponent
  },
  {
    path: 'create',
    component: SlabFormComponent
  },
  {
    path: ':id/edit',
    component: SlabFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlabRoutingModule { }
