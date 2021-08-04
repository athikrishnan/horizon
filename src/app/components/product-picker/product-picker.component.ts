import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  EventEmitter, OnDestroy, OnInit, Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PickedProduct } from 'src/app/models/picked-product.model';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { ProductPickerService } from 'src/app/services/product-picker.service';

@Component({
  selector: 'app-product-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-picker.component.html',
  styleUrls: ['./product-picker.component.scss']
})
export class ProductPickerComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  @Output() cancel = new EventEmitter<boolean>();
  @Output() productPick = new EventEmitter<PickedProduct>();
  products: Product[] = [];

  get itemSizes(): number[] {
    const items = this.products.flatMap(product => product.variants)
      .filter(variant => !!variant.size).map(variant => variant.size).sort((a, b) => b - a);
    return (items) ? [...new Set(items)] : [];
  }
  selectedSize: number;

  get variants(): ProductVariant[] {
    if (!this.selectedSize) { return []; }
    return this.products.flatMap(product => product.variants).filter(variant => variant.size === this.selectedSize)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  constructor(
    private productPickerService: ProductPickerService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.productPickerService.products$.pipe(takeUntil(this.unsubscribe$)).subscribe(products => {
      this.products = products;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onClose(): void {
    this.cancel.emit(true);
  }

  getProductByVariant(variant: ProductVariant): Product {
    return this.products.find(product => product.variants.find(item => item.id === variant.id));
  }

  onVariantSelect(variant: ProductVariant): void {
    const product: Product = this.getProductByVariant(variant);
    this.productPick.emit({
      product,
      variant
    } as PickedProduct);
  }
}
