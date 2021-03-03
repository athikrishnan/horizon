import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './item.component';
import { ItemRoutingModule } from './item-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemService } from './item.service';
import { ItemFormComponent } from './item-form/item-form.component';



@NgModule({
  declarations: [ItemComponent, ItemFormComponent],
  imports: [
    CommonModule,
    ItemRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ItemService
  ]
})
export class ItemModule { }
