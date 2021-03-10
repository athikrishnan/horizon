import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  showSpinner = true;
  customerForm: FormGroup = this.fb.group({
    id: null,
    name: [null, Validators.required],
    address: this.fb.group({
      street: null,
      locality: null,
      city: null,
      zip: null,
      state: null
    }),
    phone: [null, Validators.required],
    email: [null, Validators.email],
  });

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router) { }

  ngOnInit(): void {
    this.showSpinner = false;
  }

  onSave(): void {
    this.showSpinner = true;
    const customer: Customer = this.customerForm.getRawValue() as Customer;
    this.customerService.saveCustomer(customer).then(() => {
      this.customerForm.reset();
      this.showSpinner = false;
      this.router.navigate(['customer/' + customer.id + '/view']);
    });
  }
}
