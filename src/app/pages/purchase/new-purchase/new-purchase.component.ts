import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Supplier } from 'src/app/models/supplier.model';
import { SupplierService } from 'src/app/services/supplier.service';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
  selector: 'app-new-purchase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.scss']
})
export class NewPurchaseComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  today = new Date();
  purchaseForm: FormGroup = this.fb.group({
    supplier: [null, Validators.required],
    date: [null, Validators.required]
  });
  suppliers: Supplier[] = [];
  get supplier(): Supplier {
    return this.purchaseForm.get('supplier').value as Supplier;
  }

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private ref: ChangeDetectorRef,
    private purchaseService: PurchaseService,
    private router: Router) { }

  ngOnInit(): void {
    this.supplierService.suppliers$.pipe(takeUntil(this.unsubscribe$)).subscribe(suppliers => {
      this.suppliers = suppliers;
      if (this.suppliers.length > 0) {
        this.purchaseForm.patchValue({
          supplier: this.suppliers[0],
          date: this.today
         });
      }
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(): void {
    this.showSpinner = true;
    const supplier = this.purchaseForm.get('supplier').value as Supplier;
    const date = new Date(this.purchaseForm.get('date').value);
    this.purchaseService.createPurchaseForSupplier(supplier, date).then((purchaseId: string) => {
      this.router.navigate(['purchase/' + purchaseId + '/view']);
    });
  }
}
