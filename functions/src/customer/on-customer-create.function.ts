import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CustomerDoc } from '../models/customer-doc.model';
import { StatDoc } from '../models/stat-doc.model';

exports.onCustomerCreate = functions.firestore
  .document('customers/{docId}')
  .onCreate(async (snapshot) => {
    const customerDoc: CustomerDoc = snapshot.data() as CustomerDoc;
    let statDoc: StatDoc = await admin.firestore().collection('stats').doc('customers').get()
      .then((snapshot) => {
        return snapshot.data() as StatDoc;
      });

    if (!statDoc) {
      statDoc = { count: 0 } as StatDoc;
    }

    statDoc.count++;
    customerDoc.code = statDoc.count;
    customerDoc.updatedAt = Date.now();

    await admin.firestore().collection('stats').doc('customers').set(statDoc);
    await admin.firestore().collection('customers').doc(customerDoc.id).set(customerDoc);
    return;
  });
