import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ProductDoc } from '../models/product-doc.model';
import { StatDoc } from '../models/stat-doc.model';

exports.onProductCreate = functions.firestore
  .document('products/{docId}')
  .onCreate(async (snapshot) => {
    const productDoc: ProductDoc = snapshot.data() as ProductDoc;
    let statDoc: StatDoc = await admin.firestore().collection('stats').doc('products').get()
      .then((snapshot) => {
        return snapshot.data() as StatDoc;
      });

    if (!statDoc) {
      statDoc = { count: 0 } as StatDoc;
    }

    statDoc.count++;
    productDoc.code = statDoc.count;

    await admin.firestore().collection('stats').doc('products').set(statDoc);
    await admin.firestore().collection('products').doc(productDoc.id).set(productDoc);
    return;
  });
