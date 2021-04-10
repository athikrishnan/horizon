import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Company } from 'src/app/models/company.model';
import { Invoice } from 'src/app/models/invoice.model';
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

  constructor(
    private companyService: CompanyService,
    private ref: ChangeDetectorRef) { }

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
    let num = this.getTotal().toString();
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ',
      'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) { return ''; }
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) { return; }

    let str = '';
    str += (+n[1] !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (+n[2] !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (+n[3] !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (+n[4] !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (+n[5] !== 0) ? ((str !== '') ? 'and ' : '')
      + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
  }
}
