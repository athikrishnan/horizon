import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { InvoicePayment } from 'src/app/models/invoice-payment.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicePaymentService {
  private invoicePaymentCollection: AngularFirestoreCollection<InvoicePayment>;

  constructor(
    private store: AngularFirestore,
    private auth: AuthService) {
    this.invoicePaymentCollection = this.store.collection<InvoicePayment>('invoicePayments');
  }

  addInvoicePayment(invoicePayment: InvoicePayment): Promise<void> {
    invoicePayment.id = this.store.createId();
    invoicePayment.recievedBy = this.auth.authUser;
    invoicePayment.createdAt = Date.now();
    invoicePayment.updatedAt = Date.now();
    return this.invoicePaymentCollection.doc(invoicePayment.id).set(invoicePayment);
  }
}
