import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrencyInputComponent } from 'src/app/components/currency-input/currency-input.component';
import { InvoicePayment } from 'src/app/models/invoice-payment.model';
import { Invoice } from 'src/app/models/invoice.model';
import { InvoicePaymentService } from 'src/app/services/invoice-payment.service';
import { KeywordService } from 'src/app/services/keyword.service';

@Component({
  selector: 'app-invoice-payment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-payment.component.html',
  styleUrls: ['./invoice-payment.component.scss']
})
export class InvoicePaymentComponent implements OnInit {

  showSpinner = false;
  invoice: Invoice;
  paymentForm: FormGroup = this.fb.group({
    amount: [null, Validators.required],
    date: [null, Validators.required]
  });
  today = new Date();
  @ViewChild('amount') amountField: CurrencyInputComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Invoice,
    private dialogRef: MatDialogRef<InvoicePaymentComponent>,
    private fb: FormBuilder,
    private invoicePaymentService: InvoicePaymentService,
    private keywordService: KeywordService) {
    this.invoice = data;
  }

  ngOnInit(): void {
    this.paymentForm.patchValue({ date: new Date() });
    setTimeout(() => {
      this.amountField.focus();
    }, 0);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.showSpinner = true;
    const amount: number = +this.paymentForm.get('amount').value;
    const date: Date = new Date(this.paymentForm.get('date').value);
    const invoicePayment: InvoicePayment = {
      invoice: this.invoice,
      amount,
      date,
      dateKeywords: this.keywordService.generateDateKeywords(date),
      paidBy: this.invoice.customer
    } as InvoicePayment;
    this.invoicePaymentService.addInvoicePayment(invoicePayment).then(() => {
      this.showSpinner = false;
      this.dialogRef.close();
    });
  }
}
