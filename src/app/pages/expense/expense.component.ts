import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Expense } from 'src/app/models/expense.model';
import { ExpenseService } from 'src/app/services/expense.service';

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
  expenses: Expense[] = [];

  constructor(
    private expenseService: ExpenseService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.expenseService.getRecentExpenses().subscribe((expenses: Expense[]) => {
      this.expenses = expenses;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }
}
