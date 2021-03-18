import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { InvoiceItem } from 'src/app/models/invoice-item.model';
import { Invoice } from 'src/app/models/invoice.model';

@Component({
  selector: 'app-invoice-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.scss']
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
    return !(!!this.item && !!this.item.productId && !!this.item.variantId
      && !!this.item.quantity && !!this.item.price);
  }
}
