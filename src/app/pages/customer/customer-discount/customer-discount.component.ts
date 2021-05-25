import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrencyInputComponent } from 'src/app/components/currency-input/currency-input.component';
import { Customer } from 'src/app/models/customer.model';
import { AlertService } from 'src/app/services/alert.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-discount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customer-discount.component.html'
})
export class CustomerDiscountComponent implements OnInit {
  showSpinner = false;
  customer: Customer;
  discountForm: FormGroup = this.fb.group({
    discount: [null, Validators.max(100)]
  });
  @ViewChild('discount') discountField: CurrencyInputComponent;

  constructor(
    private dialogRef: MatDialogRef<CustomerDiscountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private alertService: AlertService) {}

  ngOnInit(): void {
    this.customer = this.data;
    this.discountForm.patchValue({ discount: (this.customer.discount || 0) });
    setTimeout(() => {
      this.discountField.focus();
    }, 0);
  }

  onSave(): void {
    this.showSpinner = true;
    this.customer.discount = +this.discountForm.get('discount').value;
    this.customerService.saveCustomer(this.customer).then(() => {
      this.showSpinner = false;
      this.alertService.alert('Discount Saved');
      this.dialogRef.close(this.customer);
    });
  }

  onCancel(): void {
    this.dialogRef.close(this.customer);
  }
}
