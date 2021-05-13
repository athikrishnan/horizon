import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyTransactions } from 'src/app/models/daily-transactions.model';
import { Invoice } from 'src/app/models/invoice.model';
import { DailyTransactionsService } from 'src/app/services/daily-transactions.service';
import { InvoiceService } from 'src/app/services/invoice.service';

@Injectable()
export class DashboardService {
  constructor(
    private dailyBalanceReportService: DailyTransactionsService,
    private invoiceService: InvoiceService) { }

  todaysReport(): Observable<DailyTransactions> {
    return this.dailyBalanceReportService.subscribeReportForDate(new Date());
  }

  activeInvoices(): Observable<Invoice[]> {
    return this.invoiceService.getActiveInvoices();
  }
}
