import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Customer } from '../models/customer.model';
import { InvoiceItem } from '../models/invoice-item.model';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private current$: Observable<Invoice>;
  private invoiceCollection: AngularFirestoreCollection<Invoice>;

  constructor(private store: AngularFirestore) {
    this.invoiceCollection = this.store.collection<Invoice>('invoices');
  }

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
      completedAt: null,
      hideTax: false
    } as Invoice;

    return await this.store.collection<Invoice>('invoices').doc(invoice.id).set(invoice).then(() => {
      return invoice.id;
    });
  }

  async saveInvoice(invoice: Invoice): Promise<string> {
    const isNew: boolean = !invoice.id;

    if (isNew) {
      invoice.id = this.store.createId();
      invoice.createdAt = Date.now();
    }

    invoice.updatedAt = Date.now();
    invoice.total = invoice.items.reduce((a, b) => a + (b.price || 0), 0);
    invoice.totalCgst = invoice.items.reduce((a, b) => a + (b.cgst || 0), 0);
    invoice.totalSgst = invoice.items.reduce((a, b) => a + (b.sgst || 0), 0);

    return await this.invoiceCollection.doc(invoice.id).set(invoice).then(() => {
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

  async saveInvoiceItem(invoice: Invoice, item: InvoiceItem): Promise<string> {
    if (!invoice.items) {
      invoice.items = [];
    }

    const isNew: boolean = !item.id;
    item.updatedAt = Date.now();
    item = this.applyTax(item);
    if (isNew) {
      item.id = this.store.createId();
      item.createdAt = Date.now();
      invoice.items.push(item);
    } else {
      const index: number = invoice.items.findIndex(i => i.id === item.id);
      invoice.items.splice(index, 1, item);
    }

    return await this.saveInvoice(invoice);
  }

  private applyTax(item: InvoiceItem): InvoiceItem {
    item.cgst = (item.product) ? (item.price / 100) * item.product.slab.cgst : 0;
    item.sgst = (item.product) ? (item.price / 100) * item.product.slab.sgst : 0;
    return item;
  }

  async deleteInvoiceItem(invoice: Invoice, item: InvoiceItem): Promise<string> {
    const index: number = invoice.items.findIndex(i => i.id === item.id);
    invoice.items.splice(index, 1);

    return await this.saveInvoice(invoice);
  }
}
