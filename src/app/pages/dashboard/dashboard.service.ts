import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyBalanceReport } from 'src/app/models/daily-balance-report.model';
import { Invoice } from 'src/app/models/invoice.model';
import { DailyBalanceReportService } from 'src/app/services/daily-balance-report.service';
import { InvoiceService } from 'src/app/services/invoice.service';

@Injectable()
export class DashboardService {
  constructor(
    private dailyBalanceReportService: DailyBalanceReportService,
    private invoiceService: InvoiceService) { }

  todaysReport(): Observable<DailyBalanceReport> {
    return this.dailyBalanceReportService.subscribeReportForDate(new Date());
  }

  activeInvoices(): Observable<Invoice[]> {
    return this.invoiceService.getActiveInvoices();
  }
}
