import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { InvoicePaymentDoc } from '../models/invoice-payment-doc.model';
import { InvoiceDoc } from '../models/invoice-doc.model';
import { CompletedInvoiceDoc } from '../models/completed-invoice-doc.model';
import { TransactionDoc } from '../models/transaction-doc.model';
import { CustomerDoc } from '../models/customer-doc.model';

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

    // add a income entry
    await admin.firestore().collection('transactions').doc(invoicePaymentDoc.id).set({
      id: invoicePaymentDoc.id,
      type: 'InvoicePayment',
      isDebit: false,
      amount: invoicePaymentDoc.amount,
      date: invoicePaymentDoc.date,
      dateKeywords: invoicePaymentDoc.dateKeywords,
      createdBy: invoicePaymentDoc.recievedBy,
      updatedAt: Date.now(),
      createdAt: Date.now()
    } as TransactionDoc)

    // update customer balance
    await admin.firestore().collection('customers')
      .where('id', '==', invoice.customer.id).limit(1).get()
      .then(async (query) => {
        if (query.docs.length === 1) {
          const customerDoc: CustomerDoc = query.docs[0].data() as CustomerDoc;
          customerDoc.account.balance -= invoicePaymentDoc.amount;
          customerDoc.account.received += invoicePaymentDoc.amount;
          customerDoc.updatedAt = Date.now();
          await admin.firestore().collection('customers').doc(customerDoc.id).set(customerDoc);
        }
        return query;
      });

    return;
  });
