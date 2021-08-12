import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandType } from 'src/app/enums/brand-type.enum';
import { ProductCategory } from 'src/app/enums/product-category.enum';
import { ProductUnit } from 'src/app/enums/product-unit.enum';
import { Product } from 'src/app/models/product.model';
import { Slab } from 'src/app/models/slab.model';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  showSpinner = true;
  iceCreamTaxSlab: Slab = { name: 'Ice Cream', hsn: '21050000', sgst: 9, cgst: 9 } as Slab;
  productForm: FormGroup = this.fb.group({
    id: null,
    code: null,
    brand: BrandType.Pappai,
    slab: [this.iceCreamTaxSlab, Validators.required],
    unit: ProductUnit.Litre,
    createdAt: null,
    name: [null, Validators.required],
    category: [null, Validators.required],
    size: null
  });
  editId: string;
  unitList: KeyValue<ProductUnit, string>[] = [
    { key: ProductUnit.Grams, value: 'in gms' },
    { key: ProductUnit.Litre, value: 'in mls' },
    { key: ProductUnit.Each, value: 'in nos' }
  ];
  categoryList: KeyValue<ProductCategory, string>[] = [
    { key: ProductCategory.Cup, value: 'Cups' },
    { key: ProductCategory.Cone, value: 'Cones' },
    { key: ProductCategory.Others, value: 'Others' },
    { key: ProductCategory.Size, value: 'Sizes' },
    { key: ProductCategory.Special, value: 'Specials' },
    { key: ProductCategory.Stick, value: 'Sticks' }
  ];
  get slab(): Slab {
    return this.productForm.get('slab').value as Slab;
  }

  slabList: Slab[] = [this.iceCreamTaxSlab];
  brandList: KeyValue<BrandType, string>[] = [
    { key: BrandType.Pappai, value: 'Pappai' },
    { key: BrandType.Holiday, value: 'Holiday' }
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('productId');
    if (!!this.editId) {
      this.productService.getProduct(this.editId).subscribe((product: Product) => {
        this.productForm.patchValue(product);
        this.showSpinner = false;
        this.ref.detectChanges();
      });
    } else {
      this.showSpinner = false;
    }
  }

  onSave(): void {
    this.showSpinner = true;
    const product: Product = this.productForm.getRawValue() as Product;
    this.productService.saveProduct(product).then(() => {
      this.showSpinner = false;
      this.alertService.alert('Product Saved');
      this.router.navigate(['product/' + product.id + '/view']);
    });
  }

  idCompare(a: any, b: any): boolean {
    return a.id === b.id;
  }
}
