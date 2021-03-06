import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Item } from 'src/app/models/item.model';
import { Pack } from 'src/app/models/pack.model';
import { Supplier } from 'src/app/models/supplier.model';
import { ItemService } from 'src/app/services/item.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { PackService } from '../../../services/pack.service';

@Component({
  selector: 'app-pack-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pack-form.component.html',
  styleUrls: ['./pack-form.component.scss']
})
export class PackFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  packForm: FormGroup = this.fb.group({
    id: null,
    supplier: this.fb.group({
      id: ['']
    }),
    name: null,
    quantity: null,
    price: null,
    contains: this.fb.group({
      isPack: [false],
      id: null
    })
  });
  editId: string;
  items: Item[];
  packs: Pack[];
  suppliers: Supplier[];

  constructor(
    private fb: FormBuilder,
    private packService: PackService,
    private router: Router,
    private route: ActivatedRoute,
    private itemService: ItemService,
    private supplierService: SupplierService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    combineLatest([
      this.packService.packs$.pipe(takeUntil(this.unsubscribe$)),
      this.itemService.items$.pipe(takeUntil(this.unsubscribe$)),
      this.supplierService.suppliers$.pipe(takeUntil(this.unsubscribe$))
    ]).subscribe(([packs, items, suppliers]: [Pack[], Item[], Supplier[]]) => {
      this.items = items;
      this.packs = packs.filter(i => i.id !== this.editId);
      this.suppliers = suppliers;
      if (!!this.editId) {
        const pack: Pack = packs.find(i => i.id === this.editId);
        this.packForm.patchValue(pack);
      }
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onCancel(): void {
    this.router.navigate(['pack']);
  }

  onSave(): void {
    const pack: Pack = this.packForm.getRawValue();
    const supplier: Supplier = this.suppliers.find(i => i.id === pack.supplier.id);
    pack.supplier.name = supplier.name;

    if (pack.contains.isPack) {
      const selectedPack: Pack = this.packs.find(i => i.id === pack.contains.id);
      pack.contains.name = selectedPack.name;
    } else {
      const item: Item = this.items.find(i => i.id === pack.contains.id);
      pack.contains.name = item.name;
    }

    this.packService.savePack(pack).then(() => {
      if (!this.editId) {
        this.packForm.reset();
      }
    });
  }
}
