import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { PackDoc } from '../models/pack-doc.model';

exports.onPackUpdate = functions.firestore
  .document('packs/{docId}')
  .onUpdate((change) => {
    const data: PackDoc = change.after.data() as PackDoc;
    const previousData: PackDoc = change.before.data() as PackDoc;

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
