import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Customer } from '../models/customer.model';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private store: AngularFirestore) { }

  async createInvoiceForCustomer(customer: Customer): Promise<string> {
    console.log('creating invoice for: ', customer.name);

    const invoice = {
      id: this.store.createId(),
      customer,
      createdAt: Date.now(),
      updatedAt: Date.now()
    } as Invoice;

    return await this.store.collection<Invoice>('invoices').doc(invoice.id).set(invoice).then(() => {
      return invoice.id;
    });
  }
}
