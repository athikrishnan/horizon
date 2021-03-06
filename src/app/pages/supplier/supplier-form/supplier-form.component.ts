import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Supplier } from 'src/app/models/supplier.model';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  supplierForm: FormGroup = this.fb.group({
    id: [''],
    name: [''],
    location: [''],
    phone: [''],
    email: ['']
  });
  editId: string;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (!!this.editId) {
      this.supplierService.suppliers$.pipe(takeUntil(this.unsubscribe$)).subscribe((suppliers: Supplier[]) => {
        const supplier: Supplier = suppliers.find(item => item.id === this.editId);
        this.supplierForm.patchValue(supplier);
        this.showSpinner = false;
        this.ref.detectChanges();
      });
    } else {
      this.showSpinner = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onCancel(): void {
    this.router.navigate(['supplier']);
  }

  onSave(): void {
    const supplier: Supplier = this.supplierForm.getRawValue();
    this.supplierService.saveSupplier(supplier).then(() => {
      if (!this.editId) {
        this.supplierForm.reset();
      }
    });
  }
}
