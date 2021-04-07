import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Invoice } from 'src/app/models/invoice.model';

@Injectable()
export class InvoiceStateService {
  private changed = new Subject<Invoice>();
  changed$ = this.changed.asObservable();

  constructor() {}

  stateChanged(invoice: Invoice): void {
    this.changed.next(invoice);
  }
}
