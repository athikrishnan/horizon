import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Purchase } from 'src/app/models/purchase.model';

@Injectable()
export class PurchaseStateService {
  private changed = new Subject<Purchase>();
  changed$ = this.changed.asObservable();

  constructor() {}

  stateChanged(purchase: Purchase): void {
    this.changed.next(purchase);
  }
}
