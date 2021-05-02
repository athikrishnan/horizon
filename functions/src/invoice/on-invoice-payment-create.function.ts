import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { InvoicePaymentDoc } from '../models/invoice-payment-doc.model';
import { InvoiceDoc } from '../models/invoice-doc.model';
import { CompletedInvoiceDoc } from '../models/completed-invoice-doc.model';

exports.onInvoicePaymentCreate = functions.firestore
  .document('invoicePayments/{docId}')
  .onCreate(async (snapshot) => {
    const invoicePaymentDoc: InvoicePaymentDoc = snapshot.data() as InvoicePaymentDoc;
    const invoice = invoicePaymentDoc.invoice as InvoiceDoc;
    invoicePaymentDoc.invoice = null;

    if (!invoice.payments) { invoice.payments = []; }
    invoice.payments.push(invoicePaymentDoc);

    // calculate invoice payment related fields
    invoice.received = 0;
    invoice.payments.forEach((payment: InvoicePaymentDoc) => {
      invoice.received += (+payment.amount);
    });
    invoice.balance = invoice.total - invoice.received;
    invoice.balance = +(invoice.balance.toFixed(2));

    // update invoice collection
    invoice.updatedAt = Date.now();
    await admin.firestore().collection('invoices').doc(invoice.id).set(invoice);

    // update completed invoice collection
    await admin.firestore().collection('completedInvoices')
      .where('invoice.id', '==', invoice.id).limit(1).get()
      .then(async (query) => {
        if (query.docs.length === 1) {
          const completedInvoideDoc: CompletedInvoiceDoc = query.docs[0].data() as CompletedInvoiceDoc;
          completedInvoideDoc.invoice = invoice;
          completedInvoideDoc.updatedAt = Date.now();
          await admin.firestore().collection('completedInvoices').doc(completedInvoideDoc.id).set(completedInvoideDoc);
        }
        return query;
      });

    return;
  });
