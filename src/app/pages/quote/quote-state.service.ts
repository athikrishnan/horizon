import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Quote } from 'src/app/models/quote.model';

// TODO: state change service can be generic?
@Injectable()
export class QuoteStateService {
  private changed = new Subject<Quote>();
  changed$ = this.changed.asObservable();

  constructor() {}

  stateChanged(quote: Quote): void {
    this.changed.next(quote);
  }
}
