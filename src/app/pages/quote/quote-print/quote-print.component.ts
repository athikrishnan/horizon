import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { Quote } from 'src/app/models/quote.model';
import { AmountInWordsService } from 'src/app/services/amount-in-words.service';

@Component({
  selector: 'app-quote-print',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quote-print.component.html',
  providers: [DecimalPipe]
})
export class QuotePrintComponent implements OnInit {
  @Input() quote: Quote;
  @ViewChild('content') content: ElementRef;
  @ViewChild('particulars') particulars: ElementRef;
  get isTaxQuote(): boolean {
    return !this.quote.hideTax;
  }

  constructor(private amountInWordsService: AmountInWordsService) { }

  ngOnInit(): void {
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
