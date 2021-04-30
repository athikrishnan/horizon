import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { SaleReturnDoc } from '../models/sale-return-doc.model';
import { StatDoc } from '../models/stat-doc.model';

exports.onSaleReturnCreate = functions.firestore
  .document('saleReturns/{docId}')
  .onCreate(async (snapshot) => {
    const saleReturnDoc: SaleReturnDoc = snapshot.data() as SaleReturnDoc;
    let statDoc: StatDoc = await admin.firestore().collection('stats').doc('saleReturns').get()
      .then((snapshot) => {
        return snapshot.data() as StatDoc;
      });

    if (!statDoc) {
      statDoc = { count: 0 } as StatDoc;
    }

    statDoc.count++;
    const date: string = (new Date()).toISOString().slice(0, 10).replace(/-/g, "") + '-';
    const customerCode = saleReturnDoc.customer.code.toString() + '-';
    const code: string = statDoc.count.toString();
    saleReturnDoc.code = 'SR' + date + customerCode + code;

    await admin.firestore().collection('stats').doc('saleReturns').set(statDoc);
    await admin.firestore().collection('saleReturns').doc(saleReturnDoc.id).set(saleReturnDoc);
    return;
  });
