import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlabComponent } from './slab.component';
import { SlabFormComponent } from './slab-form/slab-form.component';
import { SlabRoutingModule } from './slab-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SlabComponent, SlabFormComponent],
  imports: [
    CommonModule,
    SlabRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SlabModule { }
