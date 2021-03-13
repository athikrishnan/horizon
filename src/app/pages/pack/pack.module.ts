import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackComponent } from './pack.component';
import { PackFormComponent } from './pack-form/pack-form.component';
import { PackRoutingModule } from './pack-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [PackComponent, PackFormComponent],
  imports: [
    CommonModule,
    PackRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PackModule { }
