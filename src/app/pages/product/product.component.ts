import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PickedProduct } from 'src/app/models/picked-product.model';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  showProductPicker = false;
  recents: Product[] = [];

  constructor(
    private productService: ProductService,
    private ref: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit(): void {
    this.productService.getRecents().subscribe((recents: Product[]) => {
      this.recents = recents;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onProductPick(pickedProduct: PickedProduct): void {
    this.router.navigate(['product/' + pickedProduct.product.id + '/view']);
  }
}
