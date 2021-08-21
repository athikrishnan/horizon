import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Supplier } from '../models/supplier.model';
import { KeywordService } from './keyword.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private suppliers = new ReplaySubject<Supplier[]>(1);
  suppliers$ = this.suppliers.asObservable();
  private supplierCollection: AngularFirestoreCollection<Supplier>;

  constructor(
    private store: AngularFirestore,
    private keywordService: KeywordService) {
    this.supplierCollection = this.store.collection<Supplier>('suppliers');
    this.store.collection<Supplier>('suppliers', ref => ref.limit(5)).valueChanges().subscribe((suppliers) => {
      this.suppliers.next(suppliers);
    });
  }

  async saveSupplier(supplier: Supplier): Promise<string> {
    const isNew: boolean = !supplier.id;

    if (isNew) {
      supplier.id = this.store.createId();
      supplier.createdAt = Date.now();
    }
    supplier.updatedAt = Date.now();
    supplier.keywords = this.keywordService.generateKeywords(supplier.name);

    return await this.supplierCollection.doc(supplier.id).set(supplier).then(() => {
      return supplier.id;
    });
  }

  getSupplier(id: string): Observable<Supplier> {
    return this.supplierCollection.doc(id).valueChanges().pipe(take(1));
  }

  getRecents(): Observable<Supplier[]> {
    return this.store.collection<Supplier>('suppliers', ref => ref.orderBy('createdAt').limit(5))
      .valueChanges().pipe(take(1));
  }

  deleteSupplier(supplier: Supplier): Promise<void> {
    return this.supplierCollection.doc(supplier.id).delete();
  }

  searchSuppliersByName(search: string): Observable<Supplier[]> {
    if (!isNaN(+search) && !isNaN(parseFloat(search))) {
      const code: number = +(search.padStart(3, '0'));
      return this.store.collection<Supplier>('suppliers', ref => ref.where('code', '==', code).limit(1))
        .valueChanges().pipe(take(1));
    } else {
      return this.store.collection<Supplier>(
        'suppliers',
        ref => ref.where('keywords', 'array-contains', search.toLowerCase()).limit(5)
      ).valueChanges().pipe(take(1));
    }
  }
}
