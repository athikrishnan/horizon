import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SaleReturnItem } from 'src/app/models/sale-return-item.model';
import { SaleReturn } from 'src/app/models/sale-return.model';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { SaleReturnService } from 'src/app/services/sale-return.service';

@Component({
  selector: 'app-sale-return-item-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sale-return-item-form.component.html',
  styleUrls: ['./sale-return-item-form.component.scss'],
  providers: [DecimalPipe]
})
export class SaleReturnItemFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  @Input() item: SaleReturnItem;
  @Input() saleReturn: SaleReturn;
  @Output() save = new EventEmitter<boolean>();
  saleReturnItemForm: FormGroup = this.fb.group({
    product: [null, Validators.required],
    variant: [null, Validators.required],
    quantity: [null, Validators.required],
    price: [null, Validators.required],
  });
  get product(): Product {
    return this.saleReturnItemForm.get('product').value as Product;
  }
  get variant(): ProductVariant {
    return this.saleReturnItemForm.get('variant').value as ProductVariant;
  }
  get variantList(): ProductVariant[] {
    return (!this.product) ? [] : this.product.variants;
  }

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private saleReturnService: SaleReturnService,
    private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    this.applyDefaults();

    this.saleReturnItemForm.get('quantity').valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((quantity: number) => {
        const price = this.variant.price * quantity;
        this.saleReturnItemForm.get('price').patchValue(this.decimalPipe.transform(price, '.2-2'));
        this.ref.detectChanges();
      });

    this.saleReturnItemForm.patchValue(this.item);
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
  }

  onSave(): void {
    if (this.saleReturnItemForm.dirty) {
      this.showSpinner = true;
      let item = this.saleReturnItemForm.getRawValue() as SaleReturnItem;
      item = Object.assign(this.item, item);
      item.price = +(item.price.toString().replace(/,/g, ''));
      this.saleReturnService.saveSaleReturnItem(this.saleReturn, item).then(() => {
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
    this.saleReturnService.deleteSaleReturnItem(this.saleReturn, this.item);
  }

  idCompare(a: any, b: any): boolean {
    return a.id === b.id;
  }

  onCancel(): void {
    this.save.emit(true);
    this.ref.detectChanges();
  }
}
