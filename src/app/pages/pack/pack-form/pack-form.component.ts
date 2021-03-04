import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Item } from 'src/app/models/item.model';
import { Pack } from 'src/app/models/pack.model';
import { ItemService } from 'src/app/services/item.service';
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

  constructor(
    private fb: FormBuilder,
    private packService: PackService,
    private router: Router,
    private route: ActivatedRoute,
    private itemService: ItemService) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    combineLatest([
      this.packService.packs$.pipe(takeUntil(this.unsubscribe$)),
      this.itemService.items$.pipe(takeUntil(this.unsubscribe$))
    ]).subscribe(([packs, items]: [Pack[], Item[]]) => {
      this.items = items;
      if (!!this.editId) {
        const pack: Pack = packs.find(item => item.id === this.editId);
        this.packForm.patchValue(pack);
      }
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
    const item: Item = this.items.find(i => i.id === pack.contains.id);
    pack.contains.name = item.name;

    this.packService.savePack(pack).then(() => {
      if (!this.editId) {
        this.packForm.reset();
      }
    });
  }
}
