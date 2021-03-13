import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductUnit } from 'src/app/enums/product-unit.enum';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  showSpinner = true;
  productForm: FormGroup = this.fb.group({
    id: null,
    hsn: null,
    unit: null,
    createdAt: null,
    name: [null, Validators.required]
  });
  editId: string;
  unitList: KeyValue<ProductUnit, string>[] = [
    { key: ProductUnit.Grams, value: 'in gms' },
    { key: ProductUnit.Litre, value: 'in mls' },
    { key: ProductUnit.Each, value: 'in nos' }
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
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
      this.router.navigate(['product/' + product.id + '/view']);
    });
  }
}
