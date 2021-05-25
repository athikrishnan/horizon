import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Pack } from 'src/app/models/pack.model';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { AlertService } from 'src/app/services/alert.service';
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
    packs: this.fb.array([], Validators.required),
  });
  get packArray(): FormArray {
    return this.productVariantForm.get('packs') as FormArray;
  }
  product: Product;
  variant: ProductVariant;
  packs: Pack[] = [];
  packList: Pack[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
    private packService: PackService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    const productId: string = this.route.snapshot.paramMap.get('productId');
    const variantId: string = this.route.snapshot.paramMap.get('variantId');
    combineLatest([
      this.productService.getProduct(productId),
      this.packService.getPacks()
    ]).subscribe(([product, packs]: [Product, Pack[]]) => {
      this.product = product;
      this.packList = packs;
      if (!!variantId) {
        this.variant = product.variants.find(i => i.id === variantId);
        this.productVariantForm.patchValue(this.variant);
        this.packs = this.variant.packs;
      }
      this.showSpinner = false;
      this.buildPackForm();
      this.ref.detectChanges();
    });
  }

  buildPackForm(): void {
    this.packArray.clear();

    this.packs.forEach(() => {
      this.packArray.push(this.fb.group({
        id: [null, Validators.required],
        name: [null, Validators.required],
        count: [null, Validators.required],
        price: [null, Validators.required],
        createdAt: [null, Validators.required],
        updatedAt: [null, Validators.required]
      }));
    });

    this.packArray.patchValue(this.packs);
    this.ref.detectChanges();
  }

  onSave(): void {
    this.showSpinner = true;
    const variant: ProductVariant = this.productVariantForm.getRawValue();
    this.productService.saveVariant(this.product, variant).then(() => {
      this.alertService.alert('Product variant saved');
      this.router.navigate(['/product/' + this.product.id + '/view']);
    });
  }

  onDelete(): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.productService.deleteVariant(this.product, this.variant).then(() => {
          this.alertService.alert('Product variant deleted');
          this.router.navigate(['/product/' + this.product.id + '/view']);
        });
      }
    });
  }

  isSelectedPack(pack: Pack): boolean {
    return !!this.packs.find((item: Pack) => item.id === pack.id);
  }

  onPackToggle($event: MatCheckboxChange, pack: Pack): void {
    if ($event.checked) {
      pack.price = +this.productVariantForm.get('price').value * pack.count;
      this.packs.push(pack);
    } else {
      this.packs.splice(this.packs.findIndex(i => i.id === pack.id), 1);
    }
    this.buildPackForm();
    this.productVariantForm.markAsDirty();
  }
}
