import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Item } from 'src/app/models/item.model';
import { Supplier } from 'src/app/models/supplier.model';
import { SupplierService } from '../../../services/supplier.service';
import { ItemService } from '../../../services/item.service';

@Component({
  selector: 'app-item-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  itemForm: FormGroup = this.fb.group({
    id: [''],
    supplier: [''],
    name: [''],
    quantity: [''],
    price: ['']
  });
  suppliers: Supplier[] = [];
  editId: string;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    this.itemService.items$.pipe(takeUntil(this.unsubscribe$)).subscribe((items: Item[]) => {
      if (!!this.editId) {
        const item: Item = items.find(i => i.id === this.editId);
        this.itemForm.patchValue(item);
      }
    });
    this.supplierService.suppliers$.pipe(takeUntil(this.unsubscribe$)).subscribe((suppliers: Supplier[]) => {
      this.suppliers = suppliers;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onCancel(): void {
    this.router.navigate(['item']);
  }

  onSave(): void {
    const item: Item = this.itemForm.getRawValue();
    this.itemService.saveItem(item).then(() => {
      if (!this.editId) {
        this.itemForm.reset();
      }
    });
  }
}
