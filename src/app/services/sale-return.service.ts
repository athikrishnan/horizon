import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Customer } from '../models/customer.model';
import { SaleReturnItem } from '../models/sale-return-item.model';
import { SaleReturn } from '../models/sale-return.model';
import { CompletedSaleReturn } from '../models/completed-sale-return.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SaleReturnService {
  private current$: Observable<SaleReturn>;
  private saleReturnCollection: AngularFirestoreCollection<SaleReturn>;
  private completedSaleReturnCollection: AngularFirestoreCollection<CompletedSaleReturn>;

  constructor(
    private store: AngularFirestore,
    private auth: AuthService) {
    this.saleReturnCollection = this.store.collection<SaleReturn>('saleReturns');
    this.completedSaleReturnCollection = this.store.collection<CompletedSaleReturn>('completedSaleReturns');
  }

  getActiveSaleReturns(): Observable<SaleReturn[]> {
    return this.store.collection<SaleReturn>(
      'saleReturns', (ref) => ref.where('completedAt', '==', null)
    ).valueChanges().pipe(take(1));
  }

  getRecentSaleReturns(): Observable<SaleReturn[]> {
    return this.store.collection<SaleReturn>(
      'saleReturns',
      (ref) => ref.where('completedAt', '!=', null).limit(5)
    ).valueChanges().pipe(take(1));
  }

  async createSaleReturnForCustomer(customer: Customer): Promise<string> {
    const saleReturn = {
      id: this.store.createId(),
      customer,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completedAt: null
    } as SaleReturn;

    return await this.store.collection<SaleReturn>('saleReturns').doc(saleReturn.id).set(saleReturn).then(() => {
      return saleReturn.id;
    });
  }

  async saveSaleReturn(saleReturn: SaleReturn): Promise<string> {
    if (!saleReturn.items) {
      saleReturn.items = [];
    }
    const isNew: boolean = !saleReturn.id;

    if (isNew) {
      saleReturn.id = this.store.createId();
      saleReturn.createdAt = Date.now();
    }

    saleReturn.updatedAt = Date.now();
    saleReturn.total = saleReturn.items.reduce((a, b) => a + (b.price || 0), 0);
    saleReturn.totalCgst = saleReturn.items.reduce((a, b) => a + (b.cgst || 0), 0);
    saleReturn.totalSgst = saleReturn.items.reduce((a, b) => a + (b.sgst || 0), 0);

    return await this.saleReturnCollection.doc(saleReturn.id).set(saleReturn).then(() => {
      return saleReturn.id;
    });
  }

  loadCurrentSaleReturn(saleReturnId: string): Observable<SaleReturn> {
    this.current$ = this.store.collection<SaleReturn>('saleReturns').doc(saleReturnId).valueChanges();
    return this.current$;
  }

  deleteSaleReturn(saleReturn: SaleReturn): Promise<void> {
    return this.store.collection<SaleReturn>('saleReturns').doc(saleReturn.id).delete();
  }

  async saveSaleReturnItem(saleReturn: SaleReturn, item: SaleReturnItem): Promise<string> {
    if (!saleReturn.items) {
      saleReturn.items = [];
    }

    const isNew: boolean = !item.id;
    item.updatedAt = Date.now();
    item = this.applyTax(item);
    if (isNew) {
      item.id = this.store.createId();
      item.createdAt = Date.now();
      saleReturn.items.push(item);
    } else {
      const index: number = saleReturn.items.findIndex(i => i.id === item.id);
      saleReturn.items.splice(index, 1, item);
    }

    return await this.saveSaleReturn(saleReturn);
  }

  private applyTax(item: SaleReturnItem): SaleReturnItem {
    item.cgst = (item.product) ? (item.price / 100) * item.product.slab.cgst : 0;
    item.sgst = (item.product) ? (item.price / 100) * item.product.slab.sgst : 0;
    return item;
  }

  async deleteSaleReturnItem(saleReturn: SaleReturn, item: SaleReturnItem): Promise<string> {
    const index: number = saleReturn.items.findIndex(i => i.id === item.id);
    saleReturn.items.splice(index, 1);

    return await this.saveSaleReturn(saleReturn);
  }

  completeSaleReturn(saleReturn: SaleReturn): Promise<string> {
    const id = this.store.createId();
    this.completedSaleReturnCollection.doc(id).set({
      id,
      saleReturn,
      completedBy: this.auth.authUser,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as CompletedSaleReturn);
    return this.saveSaleReturn(saleReturn);
  }
}
