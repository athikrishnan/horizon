import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Customer } from '../models/customer.model';
import { ProformaItem } from '../models/proforma-item.model';
import { Proforma } from '../models/proforma.model';

@Injectable({
  providedIn: 'root'
})
export class ProformaService {
  private current$: Observable<Proforma>;
  private proformaCollection: AngularFirestoreCollection<Proforma>;

  constructor(private store: AngularFirestore) {
    this.proformaCollection = this.store.collection<Proforma>('proformas');
  }

  getActiveProformas(): Observable<Proforma[]> {
    return this.store.collection<Proforma>(
      'proformas',
      (ref) => ref.where('completedAt', '==', null).orderBy('updatedAt', 'desc')
    ).valueChanges().pipe(take(1));
  }

  getRecentProformas(): Observable<Proforma[]> {
    return this.store.collection<Proforma>(
      'proformas',
      (ref) => ref.where('completedAt', '!=', null).orderBy('completedAt', 'desc').limit(5)
    ).valueChanges().pipe(take(1));
  }

  async createProformaForCustomer(customer: Customer): Promise<string> {
    const proforma = {
      id: this.store.createId(),
      customer,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completedAt: null,
      hideTax: false
    } as Proforma;

    return await this.store.collection<Proforma>('proformas').doc(proforma.id).set(proforma).then(() => {
      return proforma.id;
    });
  }

  async saveProforma(proforma: Proforma): Promise<string> {
    if (!proforma.items) {
      proforma.items = [];
    }
    const isNew: boolean = !proforma.id;

    if (isNew) {
      proforma.id = this.store.createId();
      proforma.createdAt = Date.now();
    }

    proforma.updatedAt = Date.now();
    proforma = this.calculateTotals(proforma);

    return await this.proformaCollection.doc(proforma.id).set(proforma).then(() => {
      return proforma.id;
    });
  }

  private calculateTotals(proforma: Proforma): Proforma {
    proforma.subTotal = proforma.items.reduce((a, b) => a + (b.price || 0), 0);
    proforma.discountAmount = (proforma.discount) ? (proforma.subTotal / 100 * proforma.discount) : 0;
    proforma.total = proforma.subTotal - proforma.discountAmount;
    proforma.totalCgst = proforma.items.reduce((a, b) => a + (b.cgst || 0), 0);
    proforma.totalSgst = proforma.items.reduce((a, b) => a + (b.sgst || 0), 0);

    return proforma;
  }

  loadCurrentProforma(proformaId: string): Observable<Proforma> {
    this.current$ = this.store.collection<Proforma>('proformas').doc(proformaId).valueChanges();
    return this.current$;
  }

  deleteProforma(proforma: Proforma): Promise<void> {
    return this.store.collection<Proforma>('proformas').doc(proforma.id).delete();
  }

  async saveProformaItem(proforma: Proforma, item: ProformaItem): Promise<string> {
    if (!proforma.items) {
      proforma.items = [];
    }

    const isNew: boolean = !item.id;
    item.updatedAt = Date.now();
    item = this.applyTax(item);
    if (isNew) {
      item.id = this.store.createId();
      item.createdAt = Date.now();
      proforma.items.push(item);
    } else {
      const index: number = proforma.items.findIndex(i => i.id === item.id);
      proforma.items.splice(index, 1, item);
    }

    return await this.saveProforma(proforma);
  }

  private applyTax(item: ProformaItem): ProformaItem {
    item.cgst = (item.product) ? (item.price / 100) * item.product.slab.cgst : 0;
    item.sgst = (item.product) ? (item.price / 100) * item.product.slab.sgst : 0;
    return item;
  }

  async deleteProformaItem(proforma: Proforma, item: ProformaItem): Promise<string> {
    const index: number = proforma.items.findIndex(i => i.id === item.id);
    proforma.items.splice(index, 1);

    return await this.saveProforma(proforma);
  }
}
