import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { TransactionDoc } from '../models/transaction-doc.model';
import { DailyTransactionsDoc } from '../models/daily-transactions-doc.model';

exports.onTransactionCreate = functions.firestore
  .document('transactions/{docId}')
  .onCreate(async (snapshot) => {
    const transactionDoc: TransactionDoc = snapshot.data() as TransactionDoc;
    const date = transactionDoc.date.toDate();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const id = day + month + year;

    let reportDoc: DailyTransactionsDoc = await admin.firestore().collection('dailyTransactions')
      .doc(id).get().then((snapshot) => {
        return snapshot.data() as DailyTransactionsDoc;
      });

    if (!reportDoc) {
      reportDoc = {
        id,
        transactions: [],
        totalExpense: 0,
        totalIncome: 0,
        balance: 0,
        updatedAt: Date.now(),
        createdAt: Date.now()
      } as DailyTransactionsDoc;
    }

    reportDoc.transactions.push(transactionDoc);
    reportDoc.totalIncome = reportDoc.transactions.filter(t => !t.isDebit).reduce((a, b) => a + ((+b.amount) || 0), 0);
    reportDoc.totalExpense = reportDoc.transactions.filter(t => t.isDebit).reduce((a, b) => a + ((+b.amount) || 0), 0);
    reportDoc.balance = (+reportDoc.totalIncome) - (+reportDoc.totalExpense);

    await admin.firestore().collection('dailyTransactions').doc(id).set(reportDoc);
    return;
  });
