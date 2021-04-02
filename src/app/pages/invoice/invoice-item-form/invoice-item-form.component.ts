import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
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
  @Input() item: InvoiceItem;
  @Input() invoice: Invoice;
  searchForm: FormGroup = this.fb.group({
    search: null
  });
  results: Product[] = [];
  product: Product;
  invoiceItemForm: FormGroup = this.fb.group({
    product: [null, Validators.required],
    variant: [null, Validators.required],
    pack: [null, Validators.required],
    quantity: [null, Validators.required],
    price: [null, Validators.required]
  });
  packList: Pack[] = [];

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private invoiceService: InvoiceService,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.product = this.item.product;
    this.searchForm.get('search').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(1000)
    ).subscribe((value: string) => {
      this.productService.searchProductsByName(value).subscribe((results: Product[]) => {
        this.results = results;
        this.ref.detectChanges();
      });
    });

    this.invoiceItemForm.get('variant').valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((variant: ProductVariant) => {
        this.packList = variant.packs;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSelectProduct(product: Product): void {
    this.product = product;
    this.invoiceItemForm.get('product').setValue(this.product);
  }

  onChangeProduct(): void {
    this.product = undefined;
    this.invoiceItemForm.get('product').setValue(this.product);
  }

  onSave(): void {
    let item = this.invoiceItemForm.getRawValue() as InvoiceItem;
    item = Object.assign(this.item, item);
    this.invoiceService.saveInvoiceItem(this.invoice, item).then(() => {
      this.ref.detectChanges();
    });
  }

  onRemove(): void {
    this.invoiceService.deleteInvoiceItem(this.invoice, this.item);
  }

  idCompare(a: any, b: any): boolean {
    return a.id === b.id;
  }
}
