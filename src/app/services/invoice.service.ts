import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Customer } from '../models/customer.model';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private current$: Observable<Invoice>;

  constructor(private store: AngularFirestore) { }

  getActiveInvoices(): Observable<Invoice[]> {
    return this.store.collection<Invoice>(
      'invoices',
      (ref) => ref.where('completedAt', '==', null).orderBy('updatedAt', 'desc')
    ).valueChanges().pipe(take(1));
  }

  async createInvoiceForCustomer(customer: Customer): Promise<string> {
    const invoice = {
      id: this.store.createId(),
      customer,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completedAt: null
    } as Invoice;

    return await this.store.collection<Invoice>('invoices').doc(invoice.id).set(invoice).then(() => {
      return invoice.id;
    });
  }

  loadCurrentInvoice(invoiceId: string): Observable<Invoice> {
    this.current$ = this.store.collection<Invoice>('invoices').doc(invoiceId).valueChanges();
    return this.current$;
  }

  deleteInvoice(invoice: Invoice): Promise<void> {
    return this.store.collection<Invoice>('invoices').doc(invoice.id).delete();
  }
}
