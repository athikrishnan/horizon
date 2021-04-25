import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { StockChange } from '../models/stock-change.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StockChangeService {
  private stockChangeCollection: AngularFirestoreCollection<StockChange>;

  constructor(
    private store: AngularFirestore,
    private auth: AuthService) {
    this.stockChangeCollection = this.store.collection<StockChange>('stockChanges');
  }

  saveStockChange(stockChange: StockChange): Promise<void> {
    const isNew: boolean = !stockChange.id;

    if (isNew) {
      stockChange.id = this.store.createId();
      stockChange.changedBy = this.auth.authUser;
      stockChange.createdAt = Date.now();
    }
    stockChange.updatedAt = Date.now();

    return this.stockChangeCollection.doc(stockChange.id).set(stockChange);
  }
}
