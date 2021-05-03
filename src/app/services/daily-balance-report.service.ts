import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DailyBalanceReport } from '../models/daily-balance-report.model';

@Injectable({
  providedIn: 'root'
})
export class DailyBalanceReportService {
  private reportCollection: AngularFirestoreCollection<DailyBalanceReport>;

  constructor(
    private store: AngularFirestore) {
    this.reportCollection = this.store.collection<DailyBalanceReport>('dailyBalanceReports');
  }

  getReportForDate(date: Date): Observable<DailyBalanceReport> {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const id = day + month + year;

    return this.reportCollection.doc(id).valueChanges().pipe(take(1));
  }
}
