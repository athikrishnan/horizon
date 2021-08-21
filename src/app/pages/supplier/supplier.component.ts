import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Supplier } from 'src/app/models/supplier.model';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-supplier',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  suppliers: Supplier[] = [];

  constructor(
    private supplierService: SupplierService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.supplierService.suppliers$.pipe(takeUntil(this.unsubscribe$)).subscribe((suppliers: Supplier[]) => {
      this.suppliers = suppliers;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
