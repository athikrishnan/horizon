import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Invoice } from 'src/app/models/invoice.model';

@Injectable()
export class InvoiceTaxStateService {
  private changed = new Subject<Invoice>();
  changed$ = this.changed.asObservable();

  constructor() {}

  taxStateChanged(invoice: Invoice): void {
    this.changed.next(invoice);
  }
}
