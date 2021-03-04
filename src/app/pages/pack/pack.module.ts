import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackComponent } from './pack.component';
import { PackListComponent } from './pack-list/pack-list.component';
import { PackFormComponent } from './pack-form/pack-form.component';



@NgModule({
  declarations: [PackComponent, PackListComponent, PackFormComponent],
  imports: [
    CommonModule
  ]
})
export class PackModule { }
