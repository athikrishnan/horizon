import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DailyBalanceReport } from 'src/app/models/daily-balance-report.model';
import { Expense } from 'src/app/models/expense.model';
import { Transaction } from 'src/app/models/transaction.model';
import { DailyBalanceReportService } from 'src/app/services/daily-balance-report.service';
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
  report: DailyBalanceReport;

  constructor(
    private fb: FormBuilder,
    private dailyBalanceReportService: DailyBalanceReportService,
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
    this.dailyBalanceReportService.getReportForDate(date).subscribe((report: DailyBalanceReport) => {
      this.report = report;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  getReportItems(): ReportItem[] {
    if (!this.report) { return []; }

    let items: ReportItem[] = [];

    this.report.incomes.forEach((income: Transaction) => {
      items.push({
        type: income.type.toString(),
        amount: income.amount,
        isExpense: false,
        createdAt: income.createdAt
      } as ReportItem);
    });

    this.report.expenses.forEach((expense: Expense) => {
      items.push({
        type: expense.type.toString(),
        amount: expense.amount,
        isExpense: true,
        createdAt: expense.createdAt
      } as ReportItem);
    });

    return items.sort((a, b) => b.createdAt - a.createdAt);
  }
}
