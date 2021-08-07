import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InvoiceItem } from 'src/app/models/invoice-item.model';
import { Invoice } from 'src/app/models/invoice.model';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-invoice-item-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-item-form.component.html',
  styleUrls: ['./invoice-item-form.component.scss'],
  providers: [DecimalPipe]
})
export class InvoiceItemFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  @Input() item: InvoiceItem;
  @Input() invoice: Invoice;
  @Output() save = new EventEmitter<boolean>();
  invoiceItemForm: FormGroup = this.fb.group({
    product: [null, Validators.required],
    variant: [null, Validators.required],
    quantity: [null, Validators.required],
    price: [{ value: null, disabled: true }, Validators.required]
  });
  get product(): Product {
    return this.invoiceItemForm.get('product').value as Product;
  }
  get variant(): ProductVariant {
    return this.invoiceItemForm.get('variant').value as ProductVariant;
  }
  get variantList(): ProductVariant[] {
    return (!this.product) ? [] : this.product.variants;
  }

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private invoiceService: InvoiceService,
    private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    this.applyDefaults();
    this.invoiceItemForm.get('quantity').valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((quantity: number) => {
        const price = this.variant.price * quantity;
        this.invoiceItemForm.get('price').patchValue(this.decimalPipe.transform(price, '.2-2'));
        this.ref.detectChanges();
      });

    this.invoiceItemForm.patchValue(this.item);
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
    if (this.invoiceItemForm.dirty) {
      this.showSpinner = true;
      let item = this.invoiceItemForm.getRawValue() as InvoiceItem;
      item = Object.assign(this.item, item);
      item.price = +(item.price.toString().replace(/,/g, ''));
      this.invoiceService.saveInvoiceItem(this.invoice, item).then(() => {
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
    this.invoiceService.deleteInvoiceItem(this.invoice, this.item);
  }

  idCompare(a: any, b: any): boolean {
    return a.id === b.id;
  }

  onCancel(): void {
    this.save.emit(true);
    this.ref.detectChanges();
  }
}
