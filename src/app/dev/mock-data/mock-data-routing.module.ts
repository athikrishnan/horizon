import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MockDataComponent } from './mock-data.component';

const routes: Routes = [
  {
    path: '',
    component: MockDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MockDataRoutingModule { }
