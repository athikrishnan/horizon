import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { SupplierDoc } from './models/supplier-doc.model';
import { ItemDoc } from './models/item-doc.model';

admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.onSupplierUpdate = functions.firestore
  .document('suppliers/{docId}')
  .onUpdate((change) => {
    const supplier: SupplierDoc = change.after.data() as SupplierDoc;
    admin.firestore().collection('items').where('supplier.id', '==', supplier.id).get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const item: ItemDoc = doc.data() as ItemDoc;
          item.supplier.name = supplier.name;
          admin.firestore().collection('items').doc(item.id).set(item);
        });
      });
  });
