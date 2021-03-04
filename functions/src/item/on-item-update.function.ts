import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ItemDoc } from '../models/item-doc.model';
import { PackDoc } from '../models/pack-doc.model';

exports.onItemUpdate = functions.firestore
  .document('items/{docId}')
  .onUpdate((change) => {
    const data: ItemDoc = change.after.data() as ItemDoc;
    const previousData: ItemDoc = change.before.data() as ItemDoc;

    if (data.name === previousData.name) {
      return null;
    }

    return admin.firestore().collection('packs').where('contains.id', '==', data.id).get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const pack: PackDoc = doc.data() as PackDoc;
        pack.contains.name = data.name;
        admin.firestore().collection('packs').doc(pack.id).set(pack);
      });
    });
  });
