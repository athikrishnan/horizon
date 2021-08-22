import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Customer } from 'src/app/models/customer.model';
import { QuoteItem } from 'src/app/models/quote-item.model';
import { Quote } from 'src/app/models/quote.model';
import { Product } from 'src/app/models/product.model';
import { QuoteService } from 'src/app/services/quote.service';
import { QuotePrintService } from '../quote-print.service';
import { QuotePrintComponent } from '../quote-print/quote-print.component';
import { StateChangedService } from 'src/app/services/state-changed.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PickedProduct } from 'src/app/models/picked-product.model';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-quote-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quote-view.component.html',
  styleUrls: ['./quote-view.component.scss'],
  providers: [DecimalPipe]
})
export class QuoteViewComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  showProductSearch = false;
  quote: Quote;
  get customer(): Customer | null {
    return (!this.quote) ? null : this.quote.customer;
  }
  @ViewChild(QuotePrintComponent) print: QuotePrintComponent;
  discountForm: FormGroup = this.fb.group({
    discount: [null, [Validators.required, Validators.min(0.01), Validators.max(100)]]
  });

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private quoteService: QuoteService,
    private dialog: MatDialog,
    private router: Router,
    private stateChangedService: StateChangedService<Quote>,
    private quotePrintService: QuotePrintService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    const quoteId: string = this.route.snapshot.paramMap.get('quoteId');
    this.quoteService.loadCurrentQuote(quoteId).pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged((a, b) => a && b && a.updatedAt === b.updatedAt)
    ).subscribe((quote: Quote) => {
      this.quote = quote;
      this.showSpinner = false;
      this.discountForm.patchValue({ discount: (this.quote.discount || 0.01) });
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onDelete(): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.quoteService.deleteQuote(this.quote).then(() => {
          this.router.navigate(['quote']);
        });
      }
    });
  }

  onProductSearchOpen(): void {
    this.showProductSearch = true;
  }

  onProductSearchCancel(): void {
    this.showProductSearch = false;
  }

  isIncompleteItem(item: QuoteItem): boolean {
    return !(!!item && !!item.product && !!item.variant
      && !!item.quantity && !!item.price);
  }

  onProductPick(pickedProduct: PickedProduct): void {
    this.showProductSearch = false;
    this.quoteService.saveQuoteItem(this.quote, {
      product: pickedProduct.product,
      variant: pickedProduct.variant,
    } as QuoteItem);
  }

  onTaxStateChange(event: MatCheckboxChange): void {
    this.showSpinner = true;
    this.quote.hideTax = !event.checked;
    this.stateChangedService.stateChanged(this.quote);
    this.saveQuote();
  }

  private saveQuote(): void {
    this.quoteService.saveQuote(this.quote).then(() => {
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  onDiscountStateChange(event: MatCheckboxChange): void {
    this.showSpinner = true;
    this.quote.hasDiscount = event.checked;
    this.quote.discount = (event.checked) ? (this.customer.discount || 0.01) : null;
    this.ref.detectChanges();
    if (this.quote.hasDiscount) {
      this.discountForm.patchValue({ discount: (this.customer.discount || 0.01) });
    }
    this.saveQuote();
  }

  onSaveDiscount(): void {
    this.showSpinner = true;
    this.quote.discount = +this.discountForm.get('discount').value;
    this.saveQuote();
  }

  getTaxableAmount(): number {
    return this.quote.total - this.getTaxAmount();
  }

  getTaxAmount(): number {
    return this.quote.totalCgst + this.quote.totalSgst;
  }

  onComplete(): void {
    this.showSpinner = true;
    this.quote.completedAt = Date.now();
    this.ref.detectChanges();
    this.stateChangedService.stateChanged(this.quote);
    this.quoteService.saveQuote(this.quote).then(() => {
      this.ref.detectChanges();
      this.showSpinner = false;
    });
  }

  onPrint(): void {
    this.quotePrintService.print(this.quote, this.print.content.nativeElement.innerHTML);
  }

  displayQuotedDate(date: number): string {
    const day = dayjs(date);
    return day.format('ddd, MMM D, YYYY');
  }
}
