import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemFormComponent } from './item-form/item-form.component';
import { ItemComponent } from './item.component';

const routes: Routes = [
  {
    path: '',
    component: ItemComponent
  },
  {
    path: 'create',
    component: ItemFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRoutingModule { }
