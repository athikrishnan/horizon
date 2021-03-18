import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Invoice } from 'src/app/models/invoice.model';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-invoice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  activeInvoices: Invoice[] = [];

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.invoiceService.getActiveInvoices().subscribe((invoices: Invoice[]) => {
      this.activeInvoices = invoices;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editInvoice(id: string): void {
    this.router.navigate(['invoice/' + id + '/view']);
  }
}
