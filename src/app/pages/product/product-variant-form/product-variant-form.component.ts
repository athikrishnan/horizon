import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Pack } from 'src/app/models/pack.model';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { PackService } from 'src/app/services/pack.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-variant-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-variant-form.component.html',
  styleUrls: ['./product-variant-form.component.scss']
})
export class ProductVariantFormComponent implements OnInit {
  showSpinner = true;
  productVariantForm = this.fb.group({
    id: null,
    createdAt: null,
    size: [null, Validators.required],
    price: [null, Validators.required],
    quantity: 0,
    packs: null,
  });
  product: Product;
  variant: ProductVariant;
  packs: Pack[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
    private packService: PackService) { }

  ngOnInit(): void {
    const productId: string = this.route.snapshot.paramMap.get('productId');
    const variantId: string = this.route.snapshot.paramMap.get('variantId');
    combineLatest([
      this.productService.getProduct(productId),
      this.packService.getPacks()
    ]).subscribe(([product, packs]: [Product, Pack[]]) => {
      this.product = product;
      this.packs = packs;
      if (!!variantId) {
        this.variant = product.variants.find(i => i.id === variantId);
        this.productVariantForm.patchValue(this.variant);
      }
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  onSave(): void {
    this.showSpinner = true;
    const variant: ProductVariant = this.productVariantForm.getRawValue();
    this.productService.saveVariant(this.product, variant).then(() => {
      this.router.navigate(['/product/' + this.product.id + '/view']);
    });
  }

  onDelete(): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.productService.deleteVariant(this.product, this.variant).then(() => {
          this.router.navigate(['/product/' + this.product.id + '/view']);
        });
      }
    });
  }

  comparePack(a: Pack, b: Pack): boolean {
    return a && b && a.id === b.id;
  }
}
