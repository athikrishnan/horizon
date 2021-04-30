import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CompletedSaleReturnDoc } from '../models/completed-sale-return-doc.model';
import { SaleReturnDoc } from '../models/sale-return-doc.model';
import { SaleReturnItemDoc } from '../models/sale-return-item-doc.model';

exports.onCompletedSaleReturnCreate = functions.firestore
  .document('completedSaleReturns/{docId}')
  .onCreate(async (snapshot) => {
    const completedSaleReturnDoc: CompletedSaleReturnDoc = snapshot.data() as CompletedSaleReturnDoc;
    const saleReturn = completedSaleReturnDoc.saleReturn as SaleReturnDoc;

    saleReturn.items.forEach(async (item: SaleReturnItemDoc) => {
      let quantity = item.variant.quantity + item.quantity;
      await admin.firestore().collection('stockChanges').doc(item.id).set({
        id: item.id,
        product: item.product,
        variant: item.variant,
        quantity: quantity,
        change: item.quantity,
        isDebit: false,
        changedBy: completedSaleReturnDoc.completedBy,
        updatedAt: Date.now(),
        createdAt: Date.now()
      });
    });
    return;
  });