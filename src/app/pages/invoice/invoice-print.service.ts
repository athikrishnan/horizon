import { Injectable } from '@angular/core';
import { Invoice } from 'src/app/models/invoice.model';
import { InvoicePrintCss } from './invoice-print/invoice-print-css';

@Injectable()
export class InvoicePrintService {
  constructor() {}

  print(invoice: Invoice, contents: string): void {
    const printWindow = window.open('', 'horizon_invoice_print');
    if (invoice.hideTax) {
      printWindow.document.write('<html><head><title> Invoice' + invoice.code + '</title>');
    } else {
      printWindow.document.write('<html><head><title> Tax Invoice - ' + invoice.code + '</title>');
    }
    printWindow.document.write('<style>' + InvoicePrintCss + '</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(contents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }
}
