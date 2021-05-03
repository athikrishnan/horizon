import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ExpenseDoc } from '../models/expense-doc.model';
import { DailyBalanceReportDoc } from '../models/daily-balance-report-doc.model';

exports.onExpenseCreate = functions.firestore
  .document('expenses/{docId}')
  .onCreate(async (snapshot) => {
    const expenseDoc: ExpenseDoc = snapshot.data() as ExpenseDoc;
    const date = expenseDoc.date.toDate();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const id = day + month + year;

    let reportDoc: DailyBalanceReportDoc = await admin.firestore().collection('dailyBalanceReports')
      .doc(id).get().then((snapshot) => {
        return snapshot.data() as DailyBalanceReportDoc;
      });

    if (!reportDoc) {
      reportDoc = {
        id,
        incomes: [],
        expenses: [],
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        updatedAt: Date.now(),
        createdAt: Date.now()
      } as DailyBalanceReportDoc;
    }

    reportDoc.expenses.push(expenseDoc);
    reportDoc.totalExpense = reportDoc.expenses.reduce((a, b) => a + ((+b.amount) || 0), 0);
    reportDoc.balance = (+reportDoc.totalIncome) - (+reportDoc.totalExpense);

    await admin.firestore().collection('dailyBalanceReports').doc(id).set(reportDoc);
    return;
  });
