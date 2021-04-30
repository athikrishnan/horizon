import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SaleReturnItem } from 'src/app/models/sale-return-item.model';
import { SaleReturn } from 'src/app/models/sale-return.model';
import { StateChangedService } from 'src/app/services/state-changed.service';

@Component({
  selector: 'app-sale-return-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sale-return-item.component.html',
  styleUrls: ['./sale-return-item.component.scss'],
  providers: [DecimalPipe]
})
export class SaleReturnItemComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  @Input() item: SaleReturnItem;
  @Input() saleReturn: SaleReturn;
  isEditMode = false;

  constructor(
    private ref: ChangeDetectorRef,
    private stateChangedService: StateChangedService<SaleReturn>) { }

  ngOnInit(): void {
    if (this.isIncompleteItem()) {
      this.isEditMode = true;
      this.ref.detectChanges();
    }

    this.stateChangedService.changed$.pipe(takeUntil(this.unsubscribe$)).subscribe((saleReturn: SaleReturn) => {
      this.saleReturn.completedAt = saleReturn.completedAt;
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
