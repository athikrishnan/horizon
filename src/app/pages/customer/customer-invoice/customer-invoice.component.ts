import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Invoice } from 'src/app/models/invoice.model';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-customer-invoice',
  templateUrl: './customer-invoice.component.html',
  styleUrls: ['./customer-invoice.component.scss']
})
export class CustomerInvoiceComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  customerInvoiceForm: FormGroup = this.fb.group({
    date: null
  });
  today = new Date();
  invoices: Invoice[] = [];
  customerId: string;

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.customerInvoiceForm.get('date').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value: string) => {
      const date = new Date(value);
      this.fetchInvoicesForDate(date);
    });

    this.customerInvoiceForm.patchValue({ date: new Date() });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private fetchInvoicesForDate(date: Date): void {
    this.showSpinner = true;
    this.invoiceService.getCompletedInvoicesForCustomerByDate(this.customerId, date).subscribe((invoices: Invoice[]) => {
      this.invoices = invoices;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  gotoInvoice(invoice: Invoice): void {
    this.router.navigate(['invoice/' + invoice.id + '/view']);
  }
}
