import { Injectable } from '@angular/core';
import { Quote } from 'src/app/models/quote.model';
import { QuotePrintCss } from './quote-print/quote-print-css';

@Injectable()
export class QuotePrintService {
  constructor() {}

  print(quote: Quote, contents: string): void {
    const printWindow = window.open('', 'horizon_quote_print');
    if (quote.hideTax) {
      printWindow.document.write('<html><head><title> Quote ' + quote.code + '</title>');
    } else {
      printWindow.document.write('<html><head><title> Tax Quote - ' + quote.code + '</title>');
    }
    printWindow.document.write('<style>' + QuotePrintCss + '</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(contents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }
}
