import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Customer } from 'src/app/models/customer.model';
import { AlertService } from 'src/app/services/alert.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  customerForm: FormGroup = this.fb.group({
    id: null,
    name: [null, Validators.required],
    storeName: [null, Validators.required],
    gstin: null,
    address: this.fb.group({
      street: null,
      locality: null,
      city: null,
      zip: null,
      state: 'Tamilnadu'
    }),
    phone: [null, Validators.required],
    email: [null, Validators.email],
  });
  customer: Customer;
  editId: string;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (!!this.editId) {
      this.customerService.getCustomer(this.editId).subscribe((customer: Customer) => {
        this.customer = customer;
        this.customerForm.patchValue(customer);
        this.showSpinner = false;
        this.ref.detectChanges();
      });
    } else {
      this.showSpinner = false;
    }

    this.customerForm.get('email').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(() => {
      this.customerForm.get('email').markAsTouched();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSave(): void {
    this.showSpinner = true;
    let customer: Customer = this.customerForm.getRawValue() as Customer;

    if (this.customer) {
      customer = Object.assign(this.customer, customer);
    }

    this.customerService.saveCustomer(customer).then(() => {
      this.showSpinner = false;
      this.alertService.alert('Customer Saved');
      this.router.navigate(['customer/' + customer.id + '/view']);
    });
  }
}
