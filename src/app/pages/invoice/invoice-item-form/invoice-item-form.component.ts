import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { InvoiceItem } from 'src/app/models/invoice-item.model';
import { Invoice } from 'src/app/models/invoice.model';
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


  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private invoiceService: InvoiceService,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.searchForm.get('search').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(1000)
    ).subscribe((value: string) => {
      this.productService.searchProductsByName(value).subscribe((results: Product[]) => {
        this.results = results;
        this.ref.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSelectProduct(product: Product): void {
    this.product = product;
    this.item.productId = product.id;
    this.item.productName = product.name;
  }

  onSave(): void {
    this.invoiceService.saveInvoiceItem(this.invoice, this.item);
  }

  onRemove(): void {
    this.invoiceService.deleteInvoiceItem(this.invoice, this.item);
  }
}
