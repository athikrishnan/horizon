import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { SupplierDoc } from '../models/supplier-doc.model';
import { ItemDoc } from '../models/item-doc.model';

exports.onSupplierUpdate = functions.firestore
  .document('suppliers/{docId}')
  .onUpdate((change) => {
    const data: SupplierDoc = change.after.data() as SupplierDoc;
    const previousData: SupplierDoc = change.before.data() as SupplierDoc;

    if (data.name === previousData.name) {
      return null;
    }

    return admin.firestore().collection('items').where('supplier.id', '==', data.id).get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const item: ItemDoc = doc.data() as ItemDoc;
        item.supplier.name = data.name;
        admin.firestore().collection('items').doc(item.id).set(item);
      });
    });
  });
