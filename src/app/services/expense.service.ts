import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Expense } from 'src/app/models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenseCollection: AngularFirestoreCollection<Expense>;

  constructor(private store: AngularFirestore) {
    this.expenseCollection = this.store.collection<Expense>('expenses');
  }

  getRecentExpenses(): Observable<Expense[]> {
    return this.store.collection<Expense>('expenses', ref => ref.orderBy('createdAt').limit(5))
      .valueChanges().pipe(take(1));
  }

  getExpense(id: string): Observable<Expense> {
    return this.expenseCollection.doc(id).valueChanges().pipe(take(1));
  }

  saveExpense(expense: Expense): Promise<void> {
    console.log(expense);
    const isNew: boolean = !expense.id;

    if (isNew) {
      expense.id = this.store.createId();
      expense.createdAt = Date.now();
    }
    expense.updatedAt = Date.now();

    return this.expenseCollection.doc(expense.id).set(expense);
  }

  deleteExpense(expense: Expense): Promise<void> {
    return this.expenseCollection.doc(expense.id).delete();
  }
}
