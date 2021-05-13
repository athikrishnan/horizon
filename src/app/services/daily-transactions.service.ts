import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DailyTransactions } from '../models/daily-transactions.model';

@Injectable({
  providedIn: 'root'
})
export class DailyTransactionsService {
  private reportCollection: AngularFirestoreCollection<DailyTransactions>;

  constructor(
    private store: AngularFirestore) {
    this.reportCollection = this.store.collection<DailyTransactions>('dailyTransactions');
  }

  getReportForDate(date: Date): Observable<DailyTransactions> {
    return this.subscribeReportForDate(date).pipe(take(1));
  }

  subscribeReportForDate(date: Date): Observable<DailyTransactions> {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const id = day + month + year;

    return this.reportCollection.doc(id).valueChanges();
  }
}
