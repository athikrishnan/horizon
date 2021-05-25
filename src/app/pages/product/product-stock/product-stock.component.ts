import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { StockChange } from 'src/app/models/stock-change.model';
import { AlertService } from 'src/app/services/alert.service';
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
    isDebit: null,
    change: [null, Validators.required],
    quantity: [null, Validators.required]
  });
  @ViewChild('form') form: any;
  get variant(): ProductVariant {
    return this.stockForm.get('variant').value as ProductVariant;
  }

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder,
    private stockChangeService: StockChangeService,
    private alertService: AlertService) { }

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
        this.stockForm.patchValue({
          current: (variant) ? variant.quantity : null,
          isDebit: false
        });
      });

    combineLatest([
      this.stockForm.get('change').valueChanges.pipe(takeUntil(this.unsubscribe$)),
      this.stockForm.get('isDebit').valueChanges.pipe(takeUntil(this.unsubscribe$))
    ]).subscribe(([change, isDebit]: [number, boolean]) => {
      if (this.variant) {
        let quantity = (isDebit) ? this.variant.quantity - change : this.variant.quantity + change;
        if (quantity < 0) { quantity = 0; }
        this.stockForm.get('quantity').setValue(quantity, { emitEvent: false });
      }
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
    this.stockChangeService.createStockChange(stockChange).then(() => {
      const variant = stockChange.variant;
      variant.quantity = stockChange.quantity;
      const index: number = this.product.variants.findIndex(i => i.id === variant.id);
      this.product.variants.splice(index, 1, variant);
      this.form.resetForm();
      this.alertService.alert('Stock changes saved');
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }
}
