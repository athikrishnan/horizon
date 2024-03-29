import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Transaction } from 'src/app/models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-income',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  showSpinner = true;
  searchForm: FormGroup = this.fb.group({
    search: null
  });
  incomes: Transaction[] = [];

  constructor(
    private transactionService: TransactionService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.transactionService.getRecentCreditTransactions().subscribe((incomes: Transaction[]) => {
      this.incomes = incomes;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  displayDate(date: any): string {
    const day = dayjs(date.toDate());
    return day.format('ddd, MMM D, YYYY h:mm A');
  }
}
