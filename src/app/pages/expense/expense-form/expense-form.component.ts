import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CurrencyInputComponent } from 'src/app/components/currency-input/currency-input.component';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { ExpenseType } from 'src/app/enums/expense-type.enum';
import { Expense } from 'src/app/models/expense.model';
import { AlertService } from 'src/app/services/alert.service';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'app-expense-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  expenseTypeList: KeyValue<ExpenseType, string>[] = [
    { key: ExpenseType.Fuel, value: 'Fuel' },
    { key: ExpenseType.Travel, value: 'Travel' },
    { key: ExpenseType.Other, value: 'Other' }
  ];
  expenseForm: FormGroup = this.fb.group({
    id: null,
    createdAt: null,
    type: [this.expenseTypeList[0].value, Validators.required],
    other: null,
    amount: [null, Validators.required],
    date: [new Date(), Validators.required],
    comments: null
  });
  @ViewChild('form') form: any;
  @ViewChild('amount') amountField: CurrencyInputComponent;
  editId: string;
  expense: Expense;
  ExpenseType = ExpenseType;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (!!this.editId) {
      this.expenseService.getExpense(this.editId).subscribe((expense: Expense) => {
        this.expense = expense;
        this.expenseForm.patchValue(expense);
        this.expenseForm.get('date').patchValue(expense.date.toDate());
        this.showSpinner = false;
        this.ref.detectChanges();
      });
    } else {
      setTimeout(() => {
        this.amountField.focus();
      }, 0);
      this.showSpinner = false;
    }

    this.expenseForm.get('type').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((type: ExpenseType) => {
      this.expenseForm.get('other').setValidators(null);
      if (type === ExpenseType.Other) {
        this.expenseForm.get('other').setValidators(Validators.required);
      }
      this.expenseForm.get('other').updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSave(): void {
    this.showSpinner = true;
    let expense: Expense = this.expenseForm.getRawValue() as Expense;
    if (this.editId) {
      expense = Object.assign(this.expense, expense);
    }

    this.expenseService.saveExpense(expense).then(() => {
      if (!this.editId) {
        this.form.resetForm();
        this.expenseForm.patchValue({ type: this.expenseTypeList[0].value });
        setTimeout(() => {
          this.amountField.focus();
        }, 0);
      }
      this.showSpinner = false;
      this.alertService.alert('Expense Created!');
      this.ref.detectChanges();
    });
  }

  onDelete(): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.expenseService.deleteExpense(this.expense).then(() => {
          this.alertService.alert('Expense Deleted!');
          this.router.navigate(['expense']);
        });
      }
    });
  }
}
