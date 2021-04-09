import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Company } from 'src/app/models/company.model';
import { Invoice } from 'src/app/models/invoice.model';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-invoice-print',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-print.component.html'
})
export class InvoicePrintComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @Input() invoice: Invoice;
  @ViewChild('content') content: ElementRef;
  company: Company;

  constructor(
    private companyService: CompanyService,
    private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.companyService.companies$.pipe(takeUntil(this.unsubscribe$)).subscribe((companies: Company[]) => {
      this.company = companies[0];
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
