import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CurrencyInputComponent } from 'src/app/components/currency-input/currency-input.component';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { IncomeType } from 'src/app/enums/income-type.enum';
import { Income } from 'src/app/models/income.model';
import { AlertService } from 'src/app/services/alert.service';
import { IncomeService } from 'src/app/services/income.service';

@Component({
  selector: 'app-income-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.scss']
})
export class IncomeFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  incomeTypeList: KeyValue<IncomeType, string>[] = [
    { key: IncomeType.Payment, value: 'Payment' },
    { key: IncomeType.AssetSale, value: 'AssetSale' },
    { key: IncomeType.Other, value: 'Other' }
  ];
  incomeForm: FormGroup = this.fb.group({
    id: null,
    createdAt: null,
    type: [this.incomeTypeList[0].value, Validators.required],
    other: null,
    amount: [null, Validators.required],
    date: [new Date(), Validators.required],
    comments: null
  });
  @ViewChild('form') form: any;
  @ViewChild('amount') amountField: CurrencyInputComponent;
  editId: string;
  income: Income;
  IncomeType = IncomeType;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private incomeService: IncomeService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('incomeId');
    if (!!this.editId) {
      this.incomeService.getIncome(this.editId).subscribe((income: Income) => {
        this.income = income;
        this.incomeForm.patchValue(income);
        this.incomeForm.get('date').patchValue(income.date.toDate());
        this.showSpinner = false;
        this.ref.detectChanges();
      });
    } else {
      setTimeout(() => {
        this.amountField.focus();
      }, 0);
      this.showSpinner = false;
    }

    this.incomeForm.get('type').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((type: IncomeType) => {
      this.incomeForm.get('other').setValidators(null);
      if (type === IncomeType.Other) {
        this.incomeForm.get('other').setValidators(Validators.required);
      }
      this.incomeForm.get('other').updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSave(): void {
    this.showSpinner = true;
    let income: Income = this.incomeForm.getRawValue() as Income;
    if (this.editId) {
      income = Object.assign(this.income, income);
    }

    this.incomeService.saveIncome(income).then(() => {
      if (!this.editId) {
        this.form.resetForm();
        this.incomeForm.patchValue({ type: this.incomeTypeList[0].value });
        setTimeout(() => {
          this.amountField.focus();
        }, 0);
      }
      this.showSpinner = false;
      this.alertService.alert('Income Created!');
      this.ref.detectChanges();
    });
  }

  onDelete(): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.incomeService.deleteIncome(this.income).then(() => {
          this.alertService.alert('Income Deleted!');
          this.router.navigate(['income']);
        });
      }
    });
  }
}
