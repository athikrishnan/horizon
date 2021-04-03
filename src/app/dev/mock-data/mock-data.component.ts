import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Supplier } from 'src/app/models/supplier.model';
import { MockDataService } from './mock-data.service';
import { Customer } from 'src/app/models/customer.model';
import { Pack } from 'src/app/models/pack.model';

@Component({
  selector: 'app-mock-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mock-data.component.html',
  styleUrls: ['./mock-data.component.scss'],
  providers: [
    MockDataService
  ]
})
export class MockDataComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  suppliers: Supplier[] = [];
  customers: Customer[] = [];
  packs: Pack[] = [];

  constructor(
    private mockDataService: MockDataService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    combineLatest([
      this.mockDataService.suppliers$.pipe((takeUntil(this.unsubscribe$))),
      this.mockDataService.customers$.pipe((takeUntil(this.unsubscribe$))),
      this.mockDataService.packs$.pipe((takeUntil(this.unsubscribe$)))
    ]).subscribe(([suppliers, customers, packs]: [Supplier[], Customer[], Pack[]]) => {
      this.suppliers = suppliers;
      this.customers = customers;
      this.packs = packs;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onGenerateCompanyDetails(): void {
    this.mockDataService.generateCompanyDetails();
  }

  onGenerateSupplier(): void {
    this.mockDataService.generateSupplier();
  }

  onGenerateCustomer(): void {
    this.mockDataService.generateCustomer();
  }

  onGeneratePack(): void {
    this.mockDataService.generatePacks();
  }
}
