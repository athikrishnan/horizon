import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Customer } from 'src/app/models/customer.model';
import { AlertService } from 'src/app/services/alert.service';
import { CustomerService } from 'src/app/services/customer.service';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-customer-new-invoice',
  templateUrl: './customer-new-invoice.component.html',
  styleUrls: ['./customer-new-invoice.component.scss']
})
export class CustomerNewInvoiceComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  customerNewInvoiceForm: FormGroup = this.fb.group({
    date: null
  });
  today = new Date();
  customerId: string;
  customer: Customer;

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (!!this.customerId) {
      this.customerService.getCustomer(this.customerId).subscribe((customer: Customer) => {
        this.customer = customer;
        this.showSpinner = false;
        this.ref.detectChanges();
      });
    } else {
      this.showSpinner = false;
    }
    this.customerNewInvoiceForm.patchValue({ date: new Date() });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(): void {
    this.showSpinner = true;
    const date = new Date(this.customerNewInvoiceForm.get('date').value);
    this.invoiceService.createInvoiceForCustomer(this.customer, date).then((invoiceId: string) => {
      this.alertService.alert('Invoice created');
      this.router.navigate(['invoice/' + invoiceId + '/view']);
    });
  }
}
