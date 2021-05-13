import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DailyTransactions } from 'src/app/models/daily-transactions.model';
import { Invoice } from 'src/app/models/invoice.model';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  report: DailyTransactions;
  activeInvoices: Invoice[] = [];
  constructor(
    private ref: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private router: Router) { }

  ngOnInit(): void {
    combineLatest([
      this.dashboardService.todaysReport().pipe(takeUntil(this.unsubscribe$)),
      this.dashboardService.activeInvoices()
    ]).subscribe(([report, invoices]: [DailyTransactions, Invoice[]]) => {
      this.report = report;
      this.activeInvoices = invoices;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  gotoReport(): void {
    this.router.navigate(['report']);
  }

  editInvoice(id: string): void {
    this.router.navigate(['invoice/' + id + '/view']);
  }
}
