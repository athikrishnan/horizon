import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierComponent } from './supplier.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierService } from './supplier.service';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';

@NgModule({
  declarations: [
    SupplierComponent,
    SupplierFormComponent,
    SupplierListComponent,
    DeleteConfirmationComponent
  ],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    SupplierService
  ]
})
export class SupplierModule { }
