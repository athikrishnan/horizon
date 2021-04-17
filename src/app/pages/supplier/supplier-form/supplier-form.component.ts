import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
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
  supplier: Supplier;
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
      this.supplierService.getSupplier(this.editId).subscribe((supplier: Supplier) => {
        this.supplier = supplier;
        this.supplierForm.patchValue(supplier);
        this.showSpinner = false;
        this.ref.detectChanges();
      });
    } else {
      this.showSpinner = false;
    }

    this.supplierForm.get('email').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(() => {
      this.supplierForm.get('email').markAsTouched();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSave(): void {
    this.showSpinner = true;
    let supplier: Supplier = this.supplierForm.getRawValue() as Supplier;

    if (this.supplier) {
      supplier = Object.assign(this.supplier, supplier);
    }

    this.supplierService.saveSupplier(supplier).then(() => {
      this.showSpinner = false;
      if (!this.editId) {
        this.router.navigate(['supplier']);
      }
      this.ref.detectChanges();
    });
  }
}
