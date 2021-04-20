import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Customer } from '../models/customer.model';
import { QuoteItem } from '../models/quote-item.model';
import { Quote } from '../models/quote.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private current$: Observable<Quote>;
  private quoteCollection: AngularFirestoreCollection<Quote>;

  constructor(private store: AngularFirestore) {
    this.quoteCollection = this.store.collection<Quote>('quotes');
  }

  getActiveQuotes(): Observable<Quote[]> {
    return this.store.collection<Quote>(
      'quotes', (ref) => ref.where('completedAt', '==', null)
    ).valueChanges().pipe(take(1));
  }

  getRecentQuotes(): Observable<Quote[]> {
    return this.store.collection<Quote>(
      'quotes', (ref) => ref.where('completedAt', '!=', null).limit(5)
    ).valueChanges().pipe(take(1));
  }

  async createQuoteForCustomer(customer: Customer): Promise<string> {
    const quote = {
      id: this.store.createId(),
      customer,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completedAt: null,
      hideTax: true
    } as Quote;

    return await this.store.collection<Quote>('quotes').doc(quote.id).set(quote).then(() => {
      return quote.id;
    });
  }

  async saveQuote(quote: Quote): Promise<string> {
    if (!quote.items) {
      quote.items = [];
    }
    const isNew: boolean = !quote.id;

    if (isNew) {
      quote.id = this.store.createId();
      quote.createdAt = Date.now();
    }

    quote.updatedAt = Date.now();
    quote.total = quote.items.reduce((a, b) => a + (b.price || 0), 0);
    quote.totalCgst = quote.items.reduce((a, b) => a + (b.cgst || 0), 0);
    quote.totalSgst = quote.items.reduce((a, b) => a + (b.sgst || 0), 0);

    return await this.quoteCollection.doc(quote.id).set(quote).then(() => {
      return quote.id;
    });
  }

  loadCurrentQuote(quoteId: string): Observable<Quote> {
    this.current$ = this.store.collection<Quote>('quotes').doc(quoteId).valueChanges();
    return this.current$;
  }

  deleteQuote(quote: Quote): Promise<void> {
    return this.store.collection<Quote>('quotes').doc(quote.id).delete();
  }

  async saveQuoteItem(quote: Quote, item: QuoteItem): Promise<string> {
    if (!quote.items) {
      quote.items = [];
    }

    const isNew: boolean = !item.id;
    item.updatedAt = Date.now();
    item = this.applyTax(item);
    if (isNew) {
      item.id = this.store.createId();
      item.createdAt = Date.now();
      quote.items.push(item);
    } else {
      const index: number = quote.items.findIndex(i => i.id === item.id);
      quote.items.splice(index, 1, item);
    }

    return await this.saveQuote(quote);
  }

  private applyTax(item: QuoteItem): QuoteItem {
    item.cgst = (item.product) ? (item.price / 100) * item.product.slab.cgst : 0;
    item.sgst = (item.product) ? (item.price / 100) * item.product.slab.sgst : 0;
    return item;
  }

  async deleteQuoteItem(quote: Quote, item: QuoteItem): Promise<string> {
    const index: number = quote.items.findIndex(i => i.id === item.id);
    quote.items.splice(index, 1);

    return await this.saveQuote(quote);
  }
}
