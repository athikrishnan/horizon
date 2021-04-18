import { Injectable } from '@angular/core';
import { Purchase } from 'src/app/models/purchase.model';
import { PurchasePrintCss } from './purchase-print/purchase-print-css';

@Injectable()
export class PurchasePrintService {
  constructor() {}

  print(purchase: Purchase, contents: string): void {
    const printWindow = window.open('', 'horizon_purchase_print');
    if (purchase.hideTax) {
      printWindow.document.write('<html><head><title> Purchase ' + purchase.code + '</title>');
    } else {
      printWindow.document.write('<html><head><title> Tax Purchase - ' + purchase.code + '</title>');
    }
    printWindow.document.write('<style>' + PurchasePrintCss + '</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(contents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }
}
