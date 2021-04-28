import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { StockChangeDoc } from '../models/stock-change-doc.model';
import { ProductDoc } from '../models/product-doc.model';

exports.onStockChangeCreate = functions.firestore
  .document('stockChanges/{docId}')
  .onCreate(async (snapshot) => {
    const stockChangeDoc: StockChangeDoc = snapshot.data() as StockChangeDoc;
    let productDoc: ProductDoc = await admin.firestore().collection('products').doc(stockChangeDoc.product.id).get()
      .then((snapshot) => {
        return snapshot.data() as ProductDoc;
      });

    const variant = stockChangeDoc.variant;
    variant.quantity = stockChangeDoc.quantity;
    const index: number = productDoc.variants.findIndex(i => i.id === variant.id);
    productDoc.variants.splice(index, 1, variant);

    await admin.firestore().collection('products').doc(productDoc.id).set(productDoc);
    return;
  });
