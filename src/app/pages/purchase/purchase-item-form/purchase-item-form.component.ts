import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PurchaseItem } from 'src/app/models/purchase-item.model';
import { Purchase } from 'src/app/models/purchase.model';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
  selector: 'app-purchase-item-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './purchase-item-form.component.html',
  styleUrls: ['./purchase-item-form.component.scss'],
  providers: [DecimalPipe]
})
export class PurchaseItemFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  @Input() item: PurchaseItem;
  @Input() purchase: Purchase;
  @Output() save = new EventEmitter<boolean>();
  purchaseItemForm: FormGroup = this.fb.group({
    product: [null, Validators.required],
    variant: [null, Validators.required],
    quantity: [null, Validators.required],
    price: [null, Validators.required]
  });
  get product(): Product {
    return this.purchaseItemForm.get('product').value as Product;
  }
  get variant(): ProductVariant {
    return this.purchaseItemForm.get('variant').value as ProductVariant;
  }
  get variantList(): ProductVariant[] {
    return (!this.product) ? [] : this.product.variants;
  }

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private purchaseService: PurchaseService,
    private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    this.applyDefaults();

    this.purchaseItemForm.get('quantity').valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((quantity: number) => {
        const price = this.variant.buyingPrice * quantity;
        this.purchaseItemForm.get('price').patchValue(this.decimalPipe.transform(price, '.2-2'));
        this.ref.detectChanges();
      });

    this.purchaseItemForm.patchValue(this.item);
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
    if (this.purchaseItemForm.dirty) {
      this.showSpinner = true;
      let item = this.purchaseItemForm.getRawValue() as PurchaseItem;
      item = Object.assign(this.item, item);
      item.price = +(item.price.toString().replace(/,/g, ''));
      this.purchaseService.savePurchaseItem(this.purchase, item).then(() => {
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
    this.purchaseService.deletePurchaseItem(this.purchase, this.item);
  }

  idCompare(a: any, b: any): boolean {
    return a.id === b.id;
  }

  onCancel(): void {
    this.save.emit(true);
    this.ref.detectChanges();
  }
}
