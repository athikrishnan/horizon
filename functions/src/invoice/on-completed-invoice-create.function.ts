import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CompletedInvoiceDoc } from '../models/completed-invoice-doc.model';
import { InvoiceDoc } from '../models/invoice-doc.model';
import { InvoiceItemDoc } from '../models/invoice-item-doc.model';
import { CustomerDoc } from '../models/customer-doc.model';

exports.onCompletedInvoiceCreate = functions.firestore
  .document('completedInvoices/{docId}')
  .onCreate(async (snapshot) => {
    const completedInvoiceDoc: CompletedInvoiceDoc = snapshot.data() as CompletedInvoiceDoc;
    const invoice = completedInvoiceDoc.invoice as InvoiceDoc;

    // update stock changes
    invoice.items.forEach(async (item: InvoiceItemDoc) => {
      let quantity = item.variant.quantity - item.quantity;
      if (quantity < 0) { quantity = 0; }
      await admin.firestore().collection('stockChanges').doc(item.id).set({
        id: item.id,
        product: item.product,
        variant: item.variant,
        quantity: quantity,
        change: item.quantity,
        isDebit: true,
        changedBy: completedInvoiceDoc.completedBy,
        updatedAt: Date.now(),
        createdAt: Date.now()
      });
    });

    // update customer balance
    await admin.firestore().collection('customers')
      .where('id', '==', invoice.customer.id).limit(1).get()
      .then(async (query) => {
        if (query.docs.length === 1) {
          const customerDoc: CustomerDoc = query.docs[0].data() as CustomerDoc;
          customerDoc.account.balance += invoice.total;
          customerDoc.updatedAt = Date.now();
          await admin.firestore().collection('customers').doc(customerDoc.id).set(customerDoc);
        }
        return query;
      });
    return;
  });
