import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Transaction } from 'src/app/models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-expense-finder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense-finder.component.html',
  styleUrls: ['./expense-finder.component.scss']
})
export class ExpenseFinderComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  showSpinner = false;
  dateForm: FormGroup = this.fb.group({
    date: null
  });
  today = new Date();
  expenses: Transaction[];
  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.dateForm.get('date').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value: string) => {
      const date = new Date(value);
      this.fetchTransactions(date);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private fetchTransactions(date: Date): void {
    this.showSpinner = true;
    this.transactionService.getDebitTransactionsByDate(date).subscribe((transactions: Transaction[]) => {
      this.expenses = transactions;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  displayDate(date: any): string {
    const day = dayjs(date.toDate());
    return day.format('ddd, MMM D, YYYY h:mm A');
  }
}
