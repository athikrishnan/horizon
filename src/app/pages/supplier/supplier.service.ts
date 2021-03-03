import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Supplier } from 'src/app/models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private supplierCollection: AngularFirestoreCollection<Supplier>;
  suppliers$: Observable<Supplier[]>;

  constructor(private store: AngularFirestore) {
    this.supplierCollection = this.store.collection('suppliers');
    this.suppliers$ = this.supplierCollection.valueChanges();
  }

  saveSupplier(supplier: Supplier): Promise<void> {
    const isNew: boolean = !supplier.id;

    if (isNew) {
      supplier.id = this.store.createId();
      supplier.createdAt = Date.now();
    }
    supplier.updatedAt = Date.now();

    return this.supplierCollection.doc(supplier.id).set(supplier);
  }

  deleteSupplier(supplier: Supplier): void {
    this.supplierCollection.doc(supplier.id).delete();
  }
}
