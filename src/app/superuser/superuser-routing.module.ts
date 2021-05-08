import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperuserComponent } from './superuser.component';
import { SuperuserGuard } from './superuser.guard';

const routes: Routes = [
  {
    path: '',
    component: SuperuserComponent,
    canActivate: [SuperuserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperuserRoutingModule { }
