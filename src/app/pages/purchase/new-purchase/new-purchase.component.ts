import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  searchForm: FormGroup = this.fb.group({
    search: null
  });
  results: Supplier[];
  supplier: Supplier;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private ref: ChangeDetectorRef,
    private purchaseService: PurchaseService,
    private router: Router) { }

  ngOnInit(): void {
    this.showSpinner = false;
    this.searchForm.get('search').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(1000)
    ).subscribe((value: string) => {
      this.supplierService.searchSuppliersByName(value).subscribe((results: Supplier[]) => {
        this.results = results;
        this.ref.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSupplierSelect(supplier: Supplier): void {
    this.supplier = supplier;
  }

  onChangeSupplier(): void {
    this.supplier = undefined;
  }

  onCreatePurchase(supplier: Supplier): void {
    this.showSpinner = true;
    this.purchaseService.createPurchaseForSupplier(supplier).then((purchaseId: string) => {
      this.router.navigate(['purchase/' + purchaseId + '/view']);
    });
  }
}
