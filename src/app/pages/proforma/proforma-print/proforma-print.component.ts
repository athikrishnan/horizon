import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Company } from 'src/app/models/company.model';
import { Proforma } from 'src/app/models/proforma.model';
import { AmountInWordsService } from 'src/app/services/amount-in-words.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-proforma-print',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proforma-print.component.html',
  providers: [DecimalPipe]
})
export class ProformaPrintComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @Input() proforma: Proforma;
  @ViewChild('content') content: ElementRef;
  @ViewChild('particulars') particulars: ElementRef;
  company: Company;
  get isTaxProforma(): boolean {
    return !this.proforma.hideTax;
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
    return this.proforma.items.reduce((a, b) => a + (b.quantity || 0), 0);
  }

  getRoundoff(): number {
    return this.proforma.total - Math.floor(this.proforma.total);
  }

  getTotal(): number {
    return Math.floor(this.proforma.total);
  }

  totalInWords(): string {
    return this.amountInWordsService.inWords(this.getTotal());
  }
}
