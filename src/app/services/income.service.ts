import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Income } from 'src/app/models/income.model';
import { AuthService } from './auth.service';
import { KeywordService } from './keyword.service';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private incomeCollection: AngularFirestoreCollection<Income>;

  constructor(
    private store: AngularFirestore,
    private auth: AuthService,
    private keywordService: KeywordService) {
    this.incomeCollection = this.store.collection<Income>('incomes');
  }

  getRecentIncomes(): Observable<Income[]> {
    return this.store.collection<Income>('incomes', ref => ref.orderBy('createdAt').limit(5))
      .valueChanges().pipe(take(1));
  }

  getIncome(id: string): Observable<Income> {
    return this.incomeCollection.doc(id).valueChanges().pipe(take(1));
  }

  saveIncome(income: Income): Promise<void> {
    const isNew: boolean = !income.id;

    if (isNew) {
      income.id = this.store.createId();
      income.createdBy = this.auth.authUser;
      income.createdAt = Date.now();
    }
    income.updatedAt = Date.now();
    income.dateKeywords = this.keywordService.generateDateKeywords(income.date);

    return this.incomeCollection.doc(income.id).set(income);
  }

  deleteIncome(income: Income): Promise<void> {
    return this.incomeCollection.doc(income.id).delete();
  }
}
