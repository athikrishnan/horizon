import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseComponent } from './showcase.component';
import { ShowcaseRoutingModule } from './showcase-routing.module';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [ShowcaseComponent],
  imports: [
    CommonModule,
    ShowcaseRoutingModule,
    MaterialModule
  ]
})
export class ShowcaseModule { }
