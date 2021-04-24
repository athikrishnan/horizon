import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ProformaDoc } from '../models/proforma-doc.model';
import { StatDoc } from '../models/stat-doc.model';

exports.onProformaCreate = functions.firestore
  .document('proformas/{docId}')
  .onCreate(async (snapshot) => {
    const proformaDoc: ProformaDoc = snapshot.data() as ProformaDoc;
    let statDoc: StatDoc = await admin.firestore().collection('stats').doc('proformas').get()
      .then((snapshot) => {
        return snapshot.data() as StatDoc;
      });

    if (!statDoc) {
      statDoc = { count: 0 } as StatDoc;
    }

    statDoc.count++;
    const date: string = (new Date()).toISOString().slice(0, 10).replace(/-/g, "") + '-';
    const customerCode = proformaDoc.customer.code.toString() + '-';
    const code: string = statDoc.count.toString();
    proformaDoc.code = 'PI' + date + customerCode + code;

    await admin.firestore().collection('stats').doc('proformas').set(statDoc);
    await admin.firestore().collection('proformas').doc(proformaDoc.id).set(proformaDoc);
    return;
  });
