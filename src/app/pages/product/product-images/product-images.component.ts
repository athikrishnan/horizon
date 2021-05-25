import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { ProductImage } from 'src/app/models/product-image.model';
import { Product } from 'src/app/models/product.model';
import { AlertService } from 'src/app/services/alert.service';
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
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private alertService: AlertService) { }

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
    this.productService.uploadImageForProduct(this.product, files).then(() => {
      this.showSpinner = false;
      this.alertService.alert('Image uploaded');
      this.ref.detectChanges();
    });
  }

  onDelete(image: ProductImage): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.productService.removeImageForProduct(this.product, image).then(() => {
          this.showSpinner = false;
          this.alertService.alert('Image deleted');
          this.ref.detectChanges();
        });
      }
    });
  }

  toggleShowcase(image: ProductImage): void {
    image.isShowcased = !image.isShowcased;
    this.showSpinner = true;
    this.productService.toggleImageShowcaseForProduct(this.product, image).then(() => {
      if (image.isShowcased) {
        this.alertService.alert('Image added to showcase');
      } else {
        this.alertService.alert('Image removed from showcase');
      }
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }
}
