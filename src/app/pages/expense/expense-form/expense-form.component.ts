import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { ExpenseType } from 'src/app/enums/expense-type.enum';
import { Expense } from 'src/app/models/expense.model';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'app-expense-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit {
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
  @ViewChild('amount') amountField: ElementRef;
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
    private dialog: MatDialog) { }

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
        this.amountField.nativeElement.focus();
      }, 0);
      this.showSpinner = false;
    }

    this.expenseForm.get('type').valueChanges.subscribe((type: ExpenseType) => {
      if (type === ExpenseType.Other) {
        this.expenseForm.get('other').setValidators(Validators.required);
      } else {
        this.expenseForm.get('other').setValidators(null);
      }
    });
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
      }
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  onDelete(): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.expenseService.deleteExpense(this.expense).then(() => {
          this.router.navigate(['expense']);
        });
      }
    });
  }
}
