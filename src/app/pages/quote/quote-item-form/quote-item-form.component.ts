import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuoteItem } from 'src/app/models/quote-item.model';
import { Quote } from 'src/app/models/quote.model';
import { Pack } from 'src/app/models/pack.model';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { QuoteService } from 'src/app/services/quote.service';

@Component({
  selector: 'app-quote-item-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quote-item-form.component.html',
  styleUrls: ['./quote-item-form.component.scss'],
  providers: [DecimalPipe]
})
export class QuoteItemFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  @Input() item: QuoteItem;
  @Input() quote: Quote;
  @Output() save = new EventEmitter<boolean>();
  quoteItemForm: FormGroup = this.fb.group({
    product: [null, Validators.required],
    variant: [null, Validators.required],
    pack: [null, Validators.required],
    quantity: [null, Validators.required],
    price: [{ value: null, disabled: true }, Validators.required]
  });
  get product(): Product {
    return this.quoteItemForm.get('product').value as Product;
  }
  get variant(): ProductVariant {
    return this.quoteItemForm.get('variant').value as ProductVariant;
  }
  get pack(): Pack {
    return this.quoteItemForm.get('pack').value as Pack;
  }
  get variantList(): ProductVariant[] {
    return (!this.product) ? [] : this.product.variants;
  }
  get packList(): Pack[] {
    return (!this.variant) ? [] : this.variant.packs;
  }

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private quoteService: QuoteService,
    private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    this.applyDefaults();

    combineLatest([
      this.quoteItemForm.get('pack').valueChanges.pipe(takeUntil(this.unsubscribe$)),
      this.quoteItemForm.get('quantity').valueChanges.pipe(takeUntil(this.unsubscribe$))
    ]).subscribe(([pack, quantity]: [Pack, number]) => {
      const price = pack.price * quantity;
      this.quoteItemForm.get('price').patchValue(this.decimalPipe.transform(price, '.2-2'));
      this.ref.detectChanges();
    });

    this.quoteItemForm.patchValue(this.item);
    this.ref.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private applyDefaults(): void {
    if (!this.item.variant && this.item.product.variants && this.item.product.variants.length > 0) {
      this.item.variant = this.item.product.variants[0];
    }

    if (this.item.variant && !this.item.pack) {
      if (this.item.variant.packs && this.item.variant.packs.length > 0) {
        this.item.pack = this.item.variant.packs[0];
      }
    }
  }

  onSave(): void {
    if (this.quoteItemForm.dirty) {
      this.showSpinner = true;
      let item = this.quoteItemForm.getRawValue() as QuoteItem;
      item = Object.assign(this.item, item);
      item.price = +(item.price.toString().replace(/,/g, ''));
      this.quoteService.saveQuoteItem(this.quote, item).then(() => {
        this.save.emit(true);
        this.showSpinner = false;
        this.ref.detectChanges();
      });
    } else {
      this.save.emit(true);
      this.ref.detectChanges();
    }
  }

  onRemove(): void {
    this.quoteService.deleteQuoteItem(this.quote, this.item);
  }

  idCompare(a: any, b: any): boolean {
    return a.id === b.id;
  }

  onCancel(): void {
    this.save.emit(true);
    this.ref.detectChanges();
  }
}
