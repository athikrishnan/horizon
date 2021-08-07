import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProformaItem } from 'src/app/models/proforma-item.model';
import { Proforma } from 'src/app/models/proforma.model';
import { StateChangedService } from 'src/app/services/state-changed.service';

@Component({
  selector: 'app-proforma-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proforma-item.component.html',
  styleUrls: ['./proforma-item.component.scss'],
  providers: [DecimalPipe]
})
export class ProformaItemComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  @Input() item: ProformaItem;
  @Input() proforma: Proforma;
  isEditMode = false;

  constructor(
    private ref: ChangeDetectorRef,
    private stateChangedService: StateChangedService<Proforma>) { }

  ngOnInit(): void {
    if (this.isIncompleteItem()) {
      this.isEditMode = true;
      this.ref.detectChanges();
    }

    this.stateChangedService.changed$.pipe(takeUntil(this.unsubscribe$)).subscribe((proforma: Proforma) => {
      this.proforma.hideTax = proforma.hideTax;
      this.proforma.completedAt = proforma.completedAt;
      this.ref.detectChanges();
    });
  }

  isIncompleteItem(): boolean {
    return !(!!this.item && !!this.item.product && !!this.item.variant
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
