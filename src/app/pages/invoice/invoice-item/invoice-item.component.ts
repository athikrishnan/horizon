import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { InvoiceItem } from 'src/app/models/invoice-item.model';
import { Invoice } from 'src/app/models/invoice.model';

@Component({
  selector: 'app-invoice-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss'],
  providers: [DecimalPipe]
})
export class InvoiceItemComponent implements OnInit {
  @Input() item: InvoiceItem;
  @Input() invoice: Invoice;
  isEditMode = false;


  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.isIncompleteItem()) {
      this.isEditMode = true;
      this.ref.detectChanges();
    }
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
    if (!this.item.price) { return 0; }
    return (+this.item.price / 100) * (this.item.product.slab.cgst + this.item.product.slab.sgst);
  }
}
