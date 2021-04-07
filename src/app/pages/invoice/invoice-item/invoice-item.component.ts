import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InvoiceItem } from 'src/app/models/invoice-item.model';
import { Invoice } from 'src/app/models/invoice.model';
import { InvoiceStateService } from '../invoice-state.service';

@Component({
  selector: 'app-invoice-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss'],
  providers: [DecimalPipe]
})
export class InvoiceItemComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  @Input() item: InvoiceItem;
  @Input() invoice: Invoice;
  isEditMode = false;

  constructor(
    private ref: ChangeDetectorRef,
    private invoiceStateService: InvoiceStateService) { }

  ngOnInit(): void {
    if (this.isIncompleteItem()) {
      this.isEditMode = true;
      this.ref.detectChanges();
    }

    this.invoiceStateService.changed$.pipe(takeUntil(this.unsubscribe$)).subscribe((invoice: Invoice) => {
      this.invoice.hideTax = invoice.hideTax;
      this.invoice.completedAt = invoice.completedAt;
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
