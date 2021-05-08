import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperuserComponent } from './superuser.component';
import { SuperuserRoutingModule } from './superuser-routing.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [SuperuserComponent],
  imports: [
    CommonModule,
    SuperuserRoutingModule,
    MaterialModule
  ]
})
export class SuperuserModule { }
