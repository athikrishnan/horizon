import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { PurchaseDoc } from '../models/purchase-doc.model';
import { StatDoc } from '../models/stat-doc.model';

exports.onPurchaseCreate = functions.firestore
  .document('purchases/{docId}')
  .onCreate(async (snapshot) => {
    const purchaseDoc: PurchaseDoc = snapshot.data() as PurchaseDoc;
    let statDoc: StatDoc = await admin.firestore().collection('stats').doc('purchases').get()
      .then((snapshot) => {
        return snapshot.data() as StatDoc;
      });

    if (!statDoc) {
      statDoc = { count: 0 } as StatDoc;
    }

    statDoc.count++;
    const date: string = (new Date()).toISOString().slice(0, 10).replace(/-/g, "") + '-';
    const supplierCode = purchaseDoc.supplier.code.toString() + '-';
    const code: string = statDoc.count.toString();
    purchaseDoc.code = 'P' + date + supplierCode + code;

    await admin.firestore().collection('stats').doc('purchases').set(statDoc);
    await admin.firestore().collection('purchases').doc(purchaseDoc.id).set(purchaseDoc);
    return;
  });
