import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Supplier } from '../models/supplier.model';
import { PurchaseItem } from '../models/purchase-item.model';
import { Purchase } from '../models/purchase.model';
import { CompletedPurchase } from '../models/completed-purchase.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private current$: Observable<Purchase>;
  private purchaseCollection: AngularFirestoreCollection<Purchase>;
  private completedPurchaseCollection: AngularFirestoreCollection<CompletedPurchase>;

  constructor(
    private store: AngularFirestore,
    private auth: AuthService) {
    this.purchaseCollection = this.store.collection<Purchase>('purchases');
    this.completedPurchaseCollection = this.store.collection<CompletedPurchase>('completedPurchases');
  }

  getActivePurchases(): Observable<Purchase[]> {
    return this.store.collection<Purchase>(
      'purchases', (ref) => ref.where('completedAt', '==', null)
    ).valueChanges().pipe(take(1));
  }

  getRecentPurchases(): Observable<Purchase[]> {
    return this.store.collection<Purchase>(
      'purchases',
      (ref) => ref.where('completedAt', '!=', null).limit(5)
    ).valueChanges().pipe(take(1));
  }

  async createPurchaseForSupplier(supplier: Supplier, date: Date): Promise<string> {
    const purchase = {
      id: this.store.createId(),
      supplier,
      date,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completedAt: null
    } as Purchase;

    return await this.store.collection<Purchase>('purchases').doc(purchase.id).set(purchase).then(() => {
      return purchase.id;
    });
  }

  async savePurchase(purchase: Purchase): Promise<string> {
    if (!purchase.items) {
      purchase.items = [];
    }
    const isNew: boolean = !purchase.id;

    if (isNew) {
      purchase.id = this.store.createId();
      purchase.createdAt = Date.now();
    }

    purchase.updatedAt = Date.now();
    purchase.total = purchase.items.reduce((a, b) => a + (b.price || 0), 0);
    purchase.totalCgst = purchase.items.reduce((a, b) => a + (b.cgst || 0), 0);
    purchase.totalSgst = purchase.items.reduce((a, b) => a + (b.sgst || 0), 0);

    return await this.purchaseCollection.doc(purchase.id).set(purchase).then(() => {
      return purchase.id;
    });
  }

  loadCurrentPurchase(purchaseId: string): Observable<Purchase> {
    this.current$ = this.store.collection<Purchase>('purchases').doc(purchaseId).valueChanges();
    return this.current$;
  }

  deletePurchase(purchase: Purchase): Promise<void> {
    return this.store.collection<Purchase>('purchases').doc(purchase.id).delete();
  }

  async savePurchaseItem(purchase: Purchase, item: PurchaseItem): Promise<string> {
    if (!purchase.items) {
      purchase.items = [];
    }

    const isNew: boolean = !item.id;
    item.updatedAt = Date.now();
    item = this.applyTax(item);
    if (isNew) {
      item.id = this.store.createId();
      item.createdAt = Date.now();
      purchase.items.push(item);
    } else {
      const index: number = purchase.items.findIndex(i => i.id === item.id);
      purchase.items.splice(index, 1, item);
    }

    return await this.savePurchase(purchase);
  }

  private applyTax(item: PurchaseItem): PurchaseItem {
    item.cgst = (item.product) ? (item.price / 100) * item.product.slab.cgst : 0;
    item.sgst = (item.product) ? (item.price / 100) * item.product.slab.sgst : 0;
    return item;
  }

  async deletePurchaseItem(purchase: Purchase, item: PurchaseItem): Promise<string> {
    const index: number = purchase.items.findIndex(i => i.id === item.id);
    purchase.items.splice(index, 1);

    return await this.savePurchase(purchase);
  }

  completePurchase(purchase: Purchase): Promise<string> {
    const id = this.store.createId();
    this.completedPurchaseCollection.doc(id).set({
      id,
      purchase,
      completedBy: this.auth.authUser,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as CompletedPurchase);
    return this.savePurchase(purchase);
  }
}
