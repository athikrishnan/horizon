import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-new-invoice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss']
})
export class NewInvoiceComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  invoiceForm: FormGroup = this.fb.group({
    customer: [null, Validators.required],
    date: [null, Validators.required]
  });
  searchForm: FormGroup = this.fb.group({
    search: null
  });
  results: Customer[];
  customer: Customer;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private ref: ChangeDetectorRef,
    private invoiceService: InvoiceService,
    private router: Router) { }

  ngOnInit(): void {
    this.showSpinner = false;
    this.invoiceForm.patchValue({ date: this.today });
    this.searchForm.get('search').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(1000)
    ).subscribe((value: string) => {
      this.customerService.searchCustomersByName(value).subscribe((results: Customer[]) => {
        this.results = results;
        this.ref.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onCustomerSelect(customer: Customer): void {
    this.customer = customer;
    this.invoiceForm.patchValue({ customer: this.customer });
  }

  onChangeCustomer(): void {
    this.customer = undefined;
    this.invoiceForm.patchValue({ customer: null });
  }

  onSubmit(): void {
    this.showSpinner = true;
    const date = new Date(this.invoiceForm.get('date').value);
    this.invoiceService.createInvoiceForCustomer(this.customer, date).then((invoiceId: string) => {
      this.router.navigate(['invoice/' + invoiceId + '/view']);
    });
  }
}
