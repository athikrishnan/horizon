import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Customer } from '../models/customer.model';
import { KeywordService } from './keyword.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customerCollection: AngularFirestoreCollection<Customer>;

  constructor(
    private store: AngularFirestore,
    private keywordService: KeywordService) {
    this.customerCollection = this.store.collection<Customer>('customers');
  }

  async saveCustomer(customer: Customer): Promise<string> {
    const isNew: boolean = !customer.id;

    if (isNew) {
      customer.id = this.store.createId();
      customer.createdAt = Date.now();
    }
    customer.updatedAt = Date.now();
    customer.keywords = this.keywordService.generateKeywords(customer.name);

    return await this.customerCollection.doc(customer.id).set(customer).then(() => {
      return customer.id;
    });
  }

  getCustomer(id: string): Observable<Customer> {
    return this.customerCollection.doc(id).valueChanges().pipe(take(1));
  }

  getRecents(): Observable<Customer[]> {
    return this.store.collection<Customer>('customers', ref => ref.orderBy('createdAt').limit(5))
      .valueChanges().pipe(take(1));
  }

  deleteCustomer(customer: Customer): Promise<void> {
    return this.customerCollection.doc(customer.id).delete();
  }

  searchCustomersByName(search: string): Observable<Customer[]> {
    if (!isNaN(+search) && !isNaN(parseFloat(search))) {
      const code: number = +(search.padStart(3, '0'));
      return this.store.collection<Customer>(
        'customers',
        ref => ref.where('code', '==', code).limit(1)
      ).valueChanges().pipe(take(1));
    } else {
      return this.store.collection<Customer>(
        'customers',
        ref => ref.where('keywords', 'array-contains', search.toLowerCase()).limit(5)
      ).valueChanges().pipe(take(1));
    }
  }
}
