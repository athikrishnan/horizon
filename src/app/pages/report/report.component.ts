import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DailyTransactions } from 'src/app/models/daily-transactions.model';
import { Transaction } from 'src/app/models/transaction.model';
import { DailyTransactionsService } from 'src/app/services/daily-transactions.service';
import { ReportItem } from './models/report-item.model';

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
  report: DailyTransactions;

  constructor(
    private fb: FormBuilder,
    private dailyBalanceReportService: DailyTransactionsService,
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
    this.dailyBalanceReportService.getReportForDate(date).subscribe((report: DailyTransactions) => {
      this.report = report;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  getReportItems(): ReportItem[] {
    if (!this.report) { return []; }

    const items: ReportItem[] = [];

    this.report.transactions.forEach((transaction: Transaction) => {
      items.push({
        type: transaction.type.toString(),
        amount: transaction.amount,
        isExpense: transaction.isDebit,
        createdAt: transaction.createdAt
      } as ReportItem);
    });

    return items.sort((a, b) => b.createdAt - a.createdAt);
  }
}
