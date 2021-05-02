import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { InvoiceDoc } from '../models/invoice-doc.model';
import { StatDoc } from '../models/stat-doc.model';

exports.onInvoiceCreate = functions.firestore
  .document('invoices/{docId}')
  .onCreate(async (snapshot) => {
    const invoiceDoc: InvoiceDoc = snapshot.data() as InvoiceDoc;
    let statDoc: StatDoc = await admin.firestore().collection('stats').doc('invoices').get()
      .then((snapshot) => {
        return snapshot.data() as StatDoc;
      });

    if (!statDoc) {
      statDoc = { count: 0 } as StatDoc;
    }

    statDoc.count++;
    const date: string = (new Date()).toISOString().slice(0, 10).replace(/-/g, '') + '-';
    const customerCode = invoiceDoc.customer.code.toString() + '-';
    const code: string = statDoc.count.toString();
    invoiceDoc.code = 'I' + date + customerCode + code;
    invoiceDoc.updatedAt = Date.now();

    await admin.firestore().collection('stats').doc('invoices').set(statDoc);
    await admin.firestore().collection('invoices').doc(invoiceDoc.id).set(invoiceDoc);
    return;
  });
