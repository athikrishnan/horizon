import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {
  showSpinner = true;
  productId: string;
  product: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.productService.getProduct(this.productId).subscribe((product: Product) => {
      this.product = product;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  onDelete(product: Product): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.productService.deleteProduct(product).then(() => {
          this.router.navigate(['product']);
        });
      }
    });
  }
}
