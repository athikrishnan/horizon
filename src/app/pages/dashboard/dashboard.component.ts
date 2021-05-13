import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Invoice } from 'src/app/models/invoice.model';
import { Transaction } from 'src/app/models/transaction.model';
import { DashboardService } from './dashboard.service';
import { DashboardReport } from './models/dashboard-report.model';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  report: DashboardReport;
  activeInvoices: Invoice[] = [];
  constructor(
    private ref: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private router: Router) { }

  ngOnInit(): void {
    combineLatest([
      this.dashboardService.todaysReport().pipe(takeUntil(this.unsubscribe$)),
      this.dashboardService.activeInvoices()
    ]).subscribe(([transactions, invoices]: [Transaction[], Invoice[]]) => {
      this.generateReport(transactions);
      this.activeInvoices = invoices;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private generateReport(transactions: Transaction[]): void {
    const totalIncome = transactions.filter(t => !t.isDebit).reduce((a, b) => a + ((+b.amount) || 0), 0);
    const totalExpense = transactions.filter(t => t.isDebit).reduce((a, b) => a + ((+b.amount) || 0), 0);
    const balance = (+totalIncome) - (+totalExpense);

    this.report = {
      balance
    };
  }

  gotoReport(): void {
    this.router.navigate(['report']);
  }

  editInvoice(id: string): void {
    this.router.navigate(['invoice/' + id + '/view']);
  }
}
