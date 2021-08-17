import { KeyValue } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  EventEmitter, OnDestroy, OnInit, Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductCategory } from 'src/app/enums/product-category.enum';
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
  selectedCategory: ProductCategory;
  categoryList: KeyValue<ProductCategory, string>[] = [
    { key: ProductCategory.Size, value: 'Sizes' },
    { key: ProductCategory.Cup, value: 'Cups' },
    { key: ProductCategory.Cone, value: 'Cones' },
    { key: ProductCategory.Special, value: 'Specials' },
    { key: ProductCategory.Stick, value: 'Sticks' },
    { key: ProductCategory.Others, value: 'Others' }
  ];

  get itemSizes(): number[] {
    const items = this.products.flatMap(product => product.variants)
      .filter(variant => !!variant.size && variant.size > 249).map(variant => variant.size).sort((a, b) => b - a);
    return (items) ? [...new Set(items)] : [];
  }
  selectedSize: number;

  get filteredProducts(): Product[] {
    if (this.selectedCategory !== ProductCategory.Size) {
      return this.products.filter(product => product.category === this.selectedCategory);
    }

    return this.products.filter(product => {
      return product.category === this.selectedCategory
        && product.variants.find(variant => variant.size === this.selectedSize);
    });
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

  onVariantSelect(product: Product, variant: ProductVariant): void {
    this.productPick.emit({
      product,
      variant
    } as PickedProduct);
  }

  resetCategory(): void {
    this.selectedCategory = null;
    this.selectedSize = null;
  }
}
