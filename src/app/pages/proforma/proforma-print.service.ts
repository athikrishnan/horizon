import { Injectable } from '@angular/core';
import { Proforma } from 'src/app/models/proforma.model';
import { ProformaPrintCss } from './proforma-print/proforma-print-css';

@Injectable()
export class ProformaPrintService {
  constructor() {}

  print(proforma: Proforma, contents: string): void {
    const printWindow = window.open('', 'horizon_proforma_print');
    if (proforma.hideTax) {
      printWindow.document.write('<html><head><title> Proforma ' + proforma.code + '</title>');
    } else {
      printWindow.document.write('<html><head><title> Tax Proforma - ' + proforma.code + '</title>');
    }
    printWindow.document.write('<style>' + ProformaPrintCss + '</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(contents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }
}
