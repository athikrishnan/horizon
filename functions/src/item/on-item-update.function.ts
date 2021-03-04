import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ItemDoc } from '../models/item-doc.model';
import { PackDoc } from '../models/pack-doc.model';

exports.onItemUpdate = functions.firestore
  .document('items/{docId}')
  .onUpdate((change) => {
    const old: ItemDoc = change.before.data() as ItemDoc;
    const item: ItemDoc = change.after.data() as ItemDoc;

    if (old.name !== item.name) {
      admin.firestore().collection('packs').where('contains.id', '==', item.id).get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const pack: PackDoc = doc.data() as PackDoc;
            pack.contains.name = item.name;
            admin.firestore().collection('packs').doc(pack.id).set(pack);
          });
        });
    }
  });
