import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Transaction } from 'src/app/models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-expense',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  showSpinner = true;
  searchForm: FormGroup = this.fb.group({
    search: null
  });
  expenses: Transaction[] = [];

  constructor(
    private transactionService: TransactionService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.transactionService.getRecentDebitTransactions().subscribe((expenses: Transaction[]) => {
      this.expenses = expenses;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  displayDate(date: any): string {
    const day = dayjs(date.toDate());
    return day.format('ddd, MMM D, YYYY h:mm A');
  }
}
