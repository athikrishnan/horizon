import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActiveInvoice } from 'src/app/models/active-invoice.model';

@Injectable({
  providedIn: 'root'
})
export class ActiveInvoiceService {
  private activeInvoiceCollection: AngularFirestoreCollection<ActiveInvoice>;

  constructor(private store: AngularFirestore) {
    this.activeInvoiceCollection = this.store.collection<ActiveInvoice>('activeInvoices');
  }

  getActiveinvoices(): Observable<ActiveInvoice[]> {
    return this.activeInvoiceCollection.valueChanges();
  }

  async createNew(): Promise<string> {
    const activeInvoice: ActiveInvoice = {
      id: this.store.createId()
    } as ActiveInvoice;
    await this.activeInvoiceCollection.doc(activeInvoice.id).set(activeInvoice);
    return activeInvoice.id;
  }
}
