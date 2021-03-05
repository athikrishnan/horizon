import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Supplier } from 'src/app/models/supplier.model';
import { MockDataService } from './mock-data.service';

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
  suppliers: Supplier[] = [];

  constructor(
    private mockDataService: MockDataService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.mockDataService.suppliers$.pipe((takeUntil(this.unsubscribe$))).subscribe((suppliers: Supplier[]) => {
      this.suppliers = suppliers;
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
}
