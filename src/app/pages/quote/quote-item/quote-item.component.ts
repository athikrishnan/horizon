import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuoteItem } from 'src/app/models/quote-item.model';
import { Quote } from 'src/app/models/quote.model';
import { QuoteStateService } from '../quote-state.service';

@Component({
  selector: 'app-quote-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quote-item.component.html',
  styleUrls: ['./quote-item.component.scss'],
  providers: [DecimalPipe] // TODO: try currency input
})
export class QuoteItemComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  @Input() item: QuoteItem;
  @Input() quote: Quote;
  isEditMode = false;

  constructor(
    private ref: ChangeDetectorRef,
    private quoteStateService: QuoteStateService) { }

  ngOnInit(): void {
    if (this.isIncompleteItem()) {
      this.isEditMode = true;
      this.ref.detectChanges();
    }

    this.quoteStateService.changed$.pipe(takeUntil(this.unsubscribe$)).subscribe((quote: Quote) => {
      this.quote.hideTax = quote.hideTax;
      this.quote.completedAt = quote.completedAt;
      this.ref.detectChanges();
    });
  }

  isIncompleteItem(): boolean {
    return !(!!this.item && !!this.item.product && !!this.item.variant && !!this.item.pack
      && !!this.item.quantity && !!this.item.price);
  }

  getTaxableAmount(): number {
    if (!this.item.price) { return 0; }
    return +this.item.price - this.getTaxAmount();
  }

  getTaxAmount(): number {
    return +(this.item.cgst + this.item.sgst);
  }
}
