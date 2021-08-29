import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { StockChange } from 'src/app/models/stock-change.model';
import { AlertService } from 'src/app/services/alert.service';
import { StockChangeService } from 'src/app/services/stock-change.service';

@Component({
  selector: 'app-stock-quick-update',
  templateUrl: './stock-quick-update.component.html',
  styleUrls: ['./stock-quick-update.component.scss']
})
export class StockQuickUpdateComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  stockForm: FormGroup = this.fb.group({
    isDebit: null,
    change: [null, Validators.required],
    quantity: [null, Validators.required]
  });
  @ViewChild('form') form: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { product: Product, variant: ProductVariant },
    private dialogRef: MatDialogRef<StockQuickUpdateComponent>,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private stockChangeService: StockChangeService,
    private alertService: AlertService) {
      this.product = data.product;
      this.variant = data.variant;
    }

  ngOnInit(): void {
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

    this.stockForm.patchValue({
      current: (this.variant) ? this.variant.quantity : null,
      isDebit: false
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.showSpinner = true;
    const stockChange = this.stockForm.getRawValue() as StockChange;
    stockChange.product = this.product;
    stockChange.variant = this.variant;
    stockChange.isDebit = stockChange.variant.quantity > stockChange.quantity;
    this.stockChangeService.createStockChange(stockChange).then(() => {
      this.alertService.alert('Stock changes saved');
      this.showSpinner = false;
      this.ref.detectChanges();
      this.dialogRef.close();
    });
  }

}
