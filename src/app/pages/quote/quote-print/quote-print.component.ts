import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Company } from 'src/app/models/company.model';
import { Quote } from 'src/app/models/quote.model';
import { AmountInWordsService } from 'src/app/services/amount-in-words.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-quote-print',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quote-print.component.html',
  providers: [DecimalPipe]
})
export class QuotePrintComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @Input() quote: Quote;
  @ViewChild('content') content: ElementRef;
  @ViewChild('particulars') particulars: ElementRef;
  company: Company;
  get isTaxQuote(): boolean {
    return !this.quote.hideTax;
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
    return this.quote.items.reduce((a, b) => a + (b.quantity || 0), 0);
  }

  getRoundoff(): number {
    return this.quote.total - Math.floor(this.quote.total);
  }

  getTotal(): number {
    return Math.floor(this.quote.total);
  }

  totalInWords(): string {
    return this.amountInWordsService.inWords(this.getTotal());
  }

  displayDate(date: number): string {
    const day = dayjs(date);
    return day.format('ddd, MMM D, YYYY');
  }
}
