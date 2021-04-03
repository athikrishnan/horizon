import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { InvoiceItem } from 'src/app/models/invoice-item.model';
import { Invoice } from 'src/app/models/invoice.model';
import { Pack } from 'src/app/models/pack.model';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-invoice-item-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-item-form.component.html',
  styleUrls: ['./invoice-item-form.component.scss']
})
export class InvoiceItemFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  @Input() item: InvoiceItem;
  @Input() invoice: Invoice;
  @Output() save = new EventEmitter<boolean>();
  searchForm: FormGroup = this.fb.group({
    search: null
  });
  results: Product[] = [];
  invoiceItemForm: FormGroup = this.fb.group({
    product: [null, Validators.required],
    variant: [null, Validators.required],
    pack: [null, Validators.required],
    quantity: [null, Validators.required],
    price: [null, Validators.required]
  });
  get product(): Product {
    return this.invoiceItemForm.get('product').value as Product;
  }
  get variant(): ProductVariant {
    return this.invoiceItemForm.get('variant').value as ProductVariant;
  }
  get pack(): Pack {
    return this.invoiceItemForm.get('pack').value as Pack;
  }
  get variantList(): ProductVariant[] {
    return (!this.product) ? [] : this.product.variants;
  }
  get packList(): Pack[] {
    const variant = this.invoiceItemForm.get('variant').value as ProductVariant;
    return (!this.variant) ? [] : this.variant.packs;
  }

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private invoiceService: InvoiceService,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.invoiceItemForm.patchValue(this.item);
    this.invoiceItemForm.updateValueAndValidity();
    this.searchForm.get('search').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(1000)
    ).subscribe((value: string) => {
      this.productService.searchProductsByName(value).subscribe((results: Product[]) => {
        this.results = results;
        this.ref.detectChanges();
      });
    });

    this.invoiceItemForm.valueChanges.subscribe(() =>  this.ref.detectChanges())
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSelectProduct(product: Product): void {
    this.invoiceItemForm.get('product').setValue(product);
  }

  onChangeProduct(): void {
    this.invoiceItemForm.get('product').setValue(null);
  }

  onSave(): void {
    if (this.invoiceItemForm.dirty) {
      this.showSpinner = true;
      let item = this.invoiceItemForm.getRawValue() as InvoiceItem;
      item = Object.assign(this.item, item);
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
    console.log(a, b, a.id === b.id);
    return a.id === b.id;
  }
}
