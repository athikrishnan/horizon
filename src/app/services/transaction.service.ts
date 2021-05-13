import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Transaction } from 'src/app/models/transaction.model';
import { AuthService } from './auth.service';
import { KeywordService } from './keyword.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionCollection: AngularFirestoreCollection<Transaction>;

  constructor(
    private store: AngularFirestore,
    private auth: AuthService,
    private keywordService: KeywordService) {
    this.transactionCollection = this.store.collection<Transaction>('transactions');
  }

  getRecentTransactions(): Observable<Transaction[]> {
    return this.store.collection<Transaction>('transactions', ref => ref.orderBy('createdAt').limit(5))
      .valueChanges().pipe(take(1));
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.transactionCollection.doc(id).valueChanges().pipe(take(1));
  }

  saveTransaction(transaction: Transaction, isDebit: boolean = false): Promise<void> {
    const isNew: boolean = !transaction.id;

    if (isNew) {
      transaction.id = this.store.createId();
      transaction.isDebit = isDebit;
      transaction.createdBy = this.auth.authUser;
      transaction.createdAt = Date.now();
    }
    transaction.updatedAt = Date.now();
    transaction.dateKeywords = this.keywordService.generateDateKeywords(transaction.date);

    return this.transactionCollection.doc(transaction.id).set(transaction);
  }

  deleteTransaction(transaction: Transaction): Promise<void> {
    return this.transactionCollection.doc(transaction.id).delete();
  }
}
