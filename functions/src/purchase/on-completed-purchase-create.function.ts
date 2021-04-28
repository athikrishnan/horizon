import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CompletedPurchaseDoc } from '../models/completed-purchase-doc.model';
import { PurchaseDoc } from '../models/purchase-doc.model';
import { PurchaseItemDoc } from '../models/purchase-item-doc.model';

exports.onCompletedPurchaseCreate = functions.firestore
  .document('completedPurchases/{docId}')
  .onCreate(async (snapshot) => {
    const completedPurchaseDoc: CompletedPurchaseDoc = snapshot.data() as CompletedPurchaseDoc;
    const purchase = completedPurchaseDoc.purchase as PurchaseDoc;

    purchase.items.forEach(async (item: PurchaseItemDoc) => {
      let quantity = item.variant.quantity + item.quantity;
      await admin.firestore().collection('stockChanges').doc(item.id).set({
        id: item.id,
        product: item.product,
        variant: item.variant,
        quantity: quantity,
        change: item.quantity,
        isDebit: false,
        changedBy: completedPurchaseDoc.completedBy,
        updatedAt: Date.now(),
        createdAt: Date.now()
      });
    });
    return;
  });