import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Transaction } from 'src/app/models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';
import { ReportItem } from './models/report-item.model';
import { Report } from './models/report.model';

@Component({
  selector: 'app-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  dateForm: FormGroup = this.fb.group({
    date: null
  });
  today = new Date();
  report: Report;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.dateForm.get('date').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value: string) => {
      const date = new Date(value);
      this.fetchReport(date);
    });

    this.dateForm.patchValue({ date: new Date() });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private fetchReport(date: Date): void {
    this.showSpinner = true;
    this.transactionService.getTransactionsByDate(date).subscribe((transactions: Transaction[]) => {
      this.generateReport(transactions);
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  private generateReport(transactions: Transaction[]): void {
    const report = {
      items: [],
      totalExpense: 0,
      totalIncome: 0,
      balance: 0
    } as Report;

    transactions.forEach((transaction: Transaction) => {
      report.items.push({
        type: transaction.type.toString(),
        amount: transaction.amount,
        isDebit: transaction.isDebit,
        createdAt: transaction.createdAt
      } as ReportItem);
    });

    report.items = report.items.sort((a, b) => b.createdAt - a.createdAt);

    report.totalIncome = report.items.filter(t => !t.isDebit).reduce((a, b) => a + ((+b.amount) || 0), 0);
    report.totalExpense = report.items.filter(t => t.isDebit).reduce((a, b) => a + ((+b.amount) || 0), 0);
    report.balance = (+report.totalIncome) - (+report.totalExpense);

    this.report = report;
  }
}
