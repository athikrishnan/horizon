import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-images',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  productId: string;
  product: Product;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.showSpinner = true;
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.productService.subscribeProduct(this.productId).pipe(takeUntil(this.unsubscribe$))
      .subscribe((product: Product) => {
        this.product = product;
        this.showSpinner = false;
        this.ref.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onChange(files: FileList): void {
    this.showSpinner = true;
    this.productService.uploadFilesForProject(this.product, files).then(() => {
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }
}
