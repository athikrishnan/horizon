import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class StateChangedService<T> {
  private changed = new Subject<T>();
  changed$ = this.changed.asObservable();

  constructor() {}

  stateChanged(item: T): void {
    this.changed.next(item);
  }
}
