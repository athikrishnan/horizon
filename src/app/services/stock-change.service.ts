import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { StockChange } from '../models/stock-change.model';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class StockChangeService {
  private stockChangeCollection: AngularFirestoreCollection<StockChange>;

  constructor(
    private store: AngularFirestore,
    private auth: AuthService,
    private productService: ProductService) {
    this.stockChangeCollection = this.store.collection<StockChange>('stockChanges');
  }

  async createStockChange(stockChange: StockChange): Promise<StockChange> {
    stockChange.id = this.store.createId();
    stockChange.changedBy = this.auth.authUser;
    stockChange.createdAt = Date.now();
    stockChange.updatedAt = Date.now();
    const variant = stockChange.variant;
    variant.quantity = stockChange.quantity;
    const index: number = stockChange.product.variants.findIndex(i => i.id === variant.id);
    stockChange.product.variants.splice(index, 1, variant);

    await this.productService.saveProduct(stockChange.product);
    await this.stockChangeCollection.doc(stockChange.id).set(stockChange);
    return stockChange;
  }
}
