import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customerCollection: AngularFirestoreCollection<Customer>;

  constructor(private store: AngularFirestore) {
    this.customerCollection = this.store.collection<Customer>('customers');
  }

  async saveCustomer(customer: Customer): Promise<string> {
    const isNew: boolean = !customer.id;

    if (isNew) {
      customer.id = this.store.createId();
      customer.createdAt = Date.now();
    }
    customer.updatedAt = Date.now();

    return await this.customerCollection.doc(customer.id).set(customer).then(() => {
      return customer.id;
    });
  }

  getCustomer(id: string): Observable<Customer> {
    return this.customerCollection.doc(id).valueChanges().pipe(take(1));
  }
}
