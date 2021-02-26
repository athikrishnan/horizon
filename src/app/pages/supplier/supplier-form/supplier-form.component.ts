import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Supplier } from 'src/app/models/supplier.model';
import { SupplierService } from '../supplier.service';

@Component({
  selector: 'app-supplier-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent implements OnInit {
  supplierForm: FormGroup = this.fb.group({
    name: [''],
    location: [''],
    phone: [''],
    email: ['']
  });

  constructor(private fb: FormBuilder,
    private supplierService: SupplierService) { }

  ngOnInit(): void {
  }

  onSave(): void {
    const supplier: Supplier = this.supplierForm.getRawValue();
    this.supplierService.saveSupplier(supplier);
  }
}
