import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CompletedInvoice } from '../models/completed-invoice.model';
import { Customer } from '../models/customer.model';
import { InvoiceItem } from '../models/invoice-item.model';
import { Invoice } from '../models/invoice.model';
import { AuthService } from './auth.service';
import { KeywordService } from './keyword.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private current$: Observable<Invoice>;
  private invoiceCollection: AngularFirestoreCollection<Invoice>;
  private completedInvoiceCollection: AngularFirestoreCollection<CompletedInvoice>;

  constructor(
    private store: AngularFirestore,
    private auth: AuthService,
    private keywordService: KeywordService) {
    this.invoiceCollection = this.store.collection<Invoice>('invoices');
    this.completedInvoiceCollection = this.store.collection<CompletedInvoice>('completedInvoices');
  }

  getActiveInvoices(): Observable<Invoice[]> {
    return this.store.collection<Invoice>(
      'invoices',
      (ref) => ref.where('completedAt', '==', null).orderBy('updatedAt', 'desc')
    ).valueChanges().pipe(take(1));
  }

  getActiveInvoicesForCustomer(customerId: string): Observable<Invoice[]> {
    return this.store.collection<Invoice>(
      'invoices',
      (ref) => ref.where('customer.id', '==', customerId).where('completedAt', '==', null).orderBy('updatedAt', 'desc')
    ).valueChanges().pipe(take(1));
  }

  getCompletedInvoicesForCustomerByDate(customerId: string, date: Date): Observable<Invoice[]> {
    const dmy: string = this.keywordService.getDMY(date);
    return this.store.collection<Invoice>(
      'invoices',
      (ref) => ref.where('customer.id', '==', customerId).where('completedAt', '!=', null)
        .where('dateKeywords', 'array-contains', dmy)
    ).valueChanges().pipe(take(1));
  }

  getRecentInvoices(): Observable<Invoice[]> {
    return this.store.collection<Invoice>(
      'invoices',
      (ref) => ref.where('completedAt', '!=', null).orderBy('completedAt', 'desc').limit(5)
    ).valueChanges().pipe(take(1));
  }

  async createInvoiceForCustomer(customer: Customer, date: Date): Promise<string> {
    const invoice = {
      id: this.store.createId(),
      customer,
      date,
      dateKeywords: this.keywordService.generateDateKeywords(date),
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
    if (!invoice.items) {
      invoice.items = [];
    }
    const isNew: boolean = !invoice.id;

    if (isNew) {
      invoice.id = this.store.createId();
      invoice.createdAt = Date.now();
    }

    invoice.updatedAt = Date.now();
    invoice = this.calculateTotals(invoice);

    return await this.invoiceCollection.doc(invoice.id).set(invoice).then(() => {
      return invoice.id;
    });
  }

  private calculateTotals(invoice: Invoice): Invoice {
    invoice.subTotal = invoice.items.reduce((a, b) => a + (b.price || 0), 0);
    invoice.discountAmount = (invoice.discount) ? (invoice.subTotal / 100 * invoice.discount) : 0;
    invoice.total = invoice.subTotal - invoice.discountAmount;
    invoice.totalCgst = invoice.items.reduce((a, b) => a + (b.cgst || 0), 0);
    invoice.totalSgst = invoice.items.reduce((a, b) => a + (b.sgst || 0), 0);

    return invoice;
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

  completeInvoice(invoice: Invoice): Promise<string> {
    const id = this.store.createId();

    invoice.received = 0;
    invoice.balance = 0;

    this.completedInvoiceCollection.doc(id).set({
      id,
      invoice,
      completedBy: this.auth.authUser,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as CompletedInvoice);
    return this.saveInvoice(invoice);
  }
}
