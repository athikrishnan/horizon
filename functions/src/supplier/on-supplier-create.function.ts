import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { SupplierDoc } from '../models/supplier-doc.model';
import { StatDoc } from '../models/stat-doc.model';

exports.onSupplierCreate = functions.firestore
  .document('suppliers/{docId}')
  .onCreate(async (snapshot) => {
    const supplierDoc: SupplierDoc = snapshot.data() as SupplierDoc;
    let statDoc: StatDoc = await admin.firestore().collection('stats').doc('suppliers').get()
      .then((snapshot) => {
        return snapshot.data() as StatDoc;
      });

    if (!statDoc) {
      statDoc = { count: 0 } as StatDoc;
    }

    statDoc.count++;
    supplierDoc.code = statDoc.count;
    supplierDoc.updatedAt = Date.now();

    await admin.firestore().collection('stats').doc('suppliers').set(statDoc);
    await admin.firestore().collection('suppliers').doc(supplierDoc.id).set(supplierDoc);
    return;
  });
