import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { ProductPickerService } from 'src/app/services/product-picker.service';
import { StockQuickUpdateComponent } from './stock-quick-update/stock-quick-update.component';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  products: Product[] = [];

  constructor(
    private productPickerService: ProductPickerService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.productPickerService.products$.pipe(takeUntil(this.unsubscribe$)).subscribe((products) => {
      this.products = products;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onVariantSelect(product: Product, variant: ProductVariant): void {
    this.dialog.open(StockQuickUpdateComponent, { data: { product, variant }});
  }
}
