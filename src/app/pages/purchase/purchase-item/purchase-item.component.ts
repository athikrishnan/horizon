import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PurchaseItem } from 'src/app/models/purchase-item.model';
import { Purchase } from 'src/app/models/purchase.model';
import { PurchaseStateService } from '../purchase-state.service';

@Component({
  selector: 'app-purchase-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './purchase-item.component.html',
  styleUrls: ['./purchase-item.component.scss'],
  providers: [DecimalPipe]
})
export class PurchaseItemComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  @Input() item: PurchaseItem;
  @Input() purchase: Purchase;
  isEditMode = false;

  constructor(
    private ref: ChangeDetectorRef,
    private purchaseStateService: PurchaseStateService) { }

  ngOnInit(): void {
    if (this.isIncompleteItem()) {
      this.isEditMode = true;
      this.ref.detectChanges();
    }

    this.purchaseStateService.changed$.pipe(takeUntil(this.unsubscribe$)).subscribe((purchase: Purchase) => {
      this.purchase.completedAt = purchase.completedAt;
      this.ref.detectChanges();
    });
  }

  isIncompleteItem(): boolean {
    return !(!!this.item && !!this.item.product && !!this.item.variant && !!this.item.pack
      && !!this.item.quantity && !!this.item.price);
  }

  getTaxableAmount(): number {
    if (!this.item.price) { return 0; }
    return +this.item.price - this.getTaxAmount();
  }

  getTaxAmount(): number {
    return +(this.item.cgst + this.item.sgst);
  }
}
