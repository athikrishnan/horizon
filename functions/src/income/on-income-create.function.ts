import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { IncomeDoc } from '../models/income-doc.model';
import { DailyBalanceReportDoc } from '../models/daily-balance-report-doc.model';

exports.onIncomeCreate = functions.firestore
  .document('incomes/{docId}')
  .onCreate(async (snapshot) => {
    const incomeDoc: IncomeDoc = snapshot.data() as IncomeDoc;
    const date = incomeDoc.date.toDate();
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
        totalExpense: 0,
        totalIncome: 0,
        balance: 0,
        updatedAt: Date.now(),
        createdAt: Date.now()
      } as DailyBalanceReportDoc;
    }

    reportDoc.incomes.push(incomeDoc);
    reportDoc.totalIncome = reportDoc.incomes.reduce((a, b) => a + ((+b.amount) || 0), 0);
    reportDoc.balance = (+reportDoc.totalIncome) - (+reportDoc.totalExpense);

    await admin.firestore().collection('dailyBalanceReports').doc(id).set(reportDoc);
    return;
  });
