import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Company } from 'src/app/models/company.model';
import { Invoice } from 'src/app/models/invoice.model';
import { AmountInWordsService } from 'src/app/services/amount-in-words.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-invoice-print',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-print.component.html',
  providers: [DecimalPipe]
})
export class InvoicePrintComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @Input() invoice: Invoice;
  @ViewChild('content') content: ElementRef;
  @ViewChild('particulars') particulars: ElementRef;
  company: Company;
  get isTaxInvoice(): boolean {
    return !this.invoice.hideTax;
  }

  constructor(
    private companyService: CompanyService,
    private ref: ChangeDetectorRef,
    private amountInWordsService: AmountInWordsService) { }

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

  getTotalQuantity(): number {
    return this.invoice.items.reduce((a, b) => a + (b.quantity || 0), 0);
  }

  getRoundoff(): number {
    return this.invoice.total - Math.floor(this.invoice.total);
  }

  getTotal(): number {
    return Math.floor(this.invoice.total);
  }

  totalInWords(): string {
    return this.amountInWordsService.inWords(this.getTotal());
  }
}
