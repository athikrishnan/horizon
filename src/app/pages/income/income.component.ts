import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Income } from 'src/app/models/income.model';
import { IncomeService } from 'src/app/services/income.service';

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
  incomes: Income[] = [];

  constructor(
    private incomeService: IncomeService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.incomeService.getRecentIncomes().subscribe((incomes: Income[]) => {
      this.incomes = incomes;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }
}
