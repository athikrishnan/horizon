import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { QuoteDoc } from '../models/quote-doc.model';
import { StatDoc } from '../models/stat-doc.model';

exports.onQuoteCreate = functions.firestore
  .document('quotes/{docId}')
  .onCreate(async (snapshot) => {
    const quoteDoc: QuoteDoc = snapshot.data() as QuoteDoc;
    let statDoc: StatDoc = await admin.firestore().collection('stats').doc('quotes').get()
      .then((snapshot) => {
        return snapshot.data() as StatDoc;
      });

    if (!statDoc) {
      statDoc = { count: 0 } as StatDoc;
    }

    statDoc.count++;
    const date: string = (new Date()).toISOString().slice(0, 10).replace(/-/g, '') + '-';
    const customerCode = quoteDoc.customer.code.toString() + '-';
    const code: string = statDoc.count.toString();
    quoteDoc.code = 'Q' + date + customerCode + code;
    quoteDoc.updatedAt = Date.now();

    await admin.firestore().collection('stats').doc('quotes').set(statDoc);
    await admin.firestore().collection('quotes').doc(quoteDoc.id).set(quoteDoc);
    return;
  });
