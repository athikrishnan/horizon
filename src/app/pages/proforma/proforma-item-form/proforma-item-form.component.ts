import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProformaItem } from 'src/app/models/proforma-item.model';
import { Proforma } from 'src/app/models/proforma.model';
import { ProductVariant } from 'src/app/models/product-variant.model';
import { Product } from 'src/app/models/product.model';
import { ProformaService } from 'src/app/services/proforma.service';

@Component({
  selector: 'app-proforma-item-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proforma-item-form.component.html',
  styleUrls: ['./proforma-item-form.component.scss'],
  providers: [DecimalPipe]
})
export class ProformaItemFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  @Input() item: ProformaItem;
  @Input() proforma: Proforma;
  @Output() save = new EventEmitter<boolean>();
  proformaItemForm: FormGroup = this.fb.group({
    product: [null, Validators.required],
    variant: [null, Validators.required],
    quantity: [null, Validators.required],
    price: [{ value: null, disabled: true }, Validators.required]
  });
  get product(): Product {
    return this.proformaItemForm.get('product').value as Product;
  }
  get variant(): ProductVariant {
    return this.proformaItemForm.get('variant').value as ProductVariant;
  }
  get variantList(): ProductVariant[] {
    return (!this.product) ? [] : this.product.variants;
  }

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private proformaService: ProformaService,
    private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    this.applyDefaults();

    combineLatest([
      this.proformaItemForm.get('variant').valueChanges.pipe(takeUntil(this.unsubscribe$)),
      this.proformaItemForm.get('quantity').valueChanges.pipe(takeUntil(this.unsubscribe$))
    ]).subscribe(([variant, quantity]: [ProductVariant, number]) => {
      const price = variant.price * quantity;
      this.proformaItemForm.get('price').patchValue(this.decimalPipe.transform(price, '.2-2'));
      this.ref.detectChanges();
    });

    this.proformaItemForm.patchValue(this.item);
    this.ref.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private applyDefaults(): void {
    if (!this.item.variant && this.item.product.variants && this.item.product.variants.length > 0) {
      this.item.variant = this.item.product.variants[0];
    }
  }

  onSave(): void {
    if (this.proformaItemForm.dirty) {
      this.showSpinner = true;
      let item = this.proformaItemForm.getRawValue() as ProformaItem;
      item = Object.assign(this.item, item);
      item.price = +(item.price.toString().replace(/,/g, ''));
      this.proformaService.saveProformaItem(this.proforma, item).then(() => {
        this.save.emit(true);
        this.showSpinner = false;
        this.ref.detectChanges();
      });
    } else {
      this.save.emit(true);
      this.ref.detectChanges();
    }
  }

  onRemove(): void {
    this.proformaService.deleteProformaItem(this.proforma, this.item);
  }

  idCompare(a: any, b: any): boolean {
    return a.id === b.id;
  }

  onCancel(): void {
    this.save.emit(true);
    this.ref.detectChanges();
  }
}
