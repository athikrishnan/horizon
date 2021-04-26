import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { StockChange } from 'src/app/models/stock-change.model';
import { ProductService } from 'src/app/services/product.service';
import { StockChangeService } from 'src/app/services/stock-change.service';

@Component({
  selector: 'app-product-stock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-stock.component.html',
  styleUrls: ['./product-stock.component.scss']
})
export class ProductStockComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  productId: string;
  product: Product;
  stockForm: FormGroup = this.fb.group({
    variant: [null, Validators.required],
    current: null,
    quantity: [null, Validators.required]
  });
  @ViewChild('form') form: any;

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder,
    private stockChangeService: StockChangeService) { }

  ngOnInit(): void {
    this.showSpinner = true;
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.productService.getProduct(this.productId).subscribe((product: Product) => {
      this.product = product;
      this.showSpinner = false;
      this.ref.detectChanges();
    });

    this.stockForm.get('variant').valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((variant: ProductVariant) => {
        this.stockForm.get('current').patchValue((variant) ? variant.quantity : null);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSave(): void {
    this.showSpinner = true;
    const stockChange = this.stockForm.getRawValue() as StockChange;
    stockChange.product = this.product;
    stockChange.isDebit = stockChange.variant.quantity > stockChange.quantity;
    this.stockChangeService.createStockChange(stockChange).then((response: StockChange) => {
      this.product = response.product;
      this.form.resetForm();
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }
}
