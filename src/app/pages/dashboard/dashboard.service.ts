import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from 'src/app/models/invoice.model';
import { Transaction } from 'src/app/models/transaction.model';
import { InvoiceService } from 'src/app/services/invoice.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Injectable()
export class DashboardService {
  constructor(
    private transactionService: TransactionService,
    private invoiceService: InvoiceService) { }

  todaysReport(): Observable<Transaction[]> {
    return this.transactionService.getTransactionsByDate(new Date());
  }

  activeInvoices(): Observable<Invoice[]> {
    return this.invoiceService.getActiveInvoices();
  }
}
