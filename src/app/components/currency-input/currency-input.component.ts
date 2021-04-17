import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self, ViewChild } from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormGroup, NgControl
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-currency-input',
  template: `
    <div role="group" [formGroup]="currencyForm" class="app-currency-input-container">
      <input type="text" formControlName="amount" autocomplete="new-amount" #amount
        (blur)="onBlur($event.target.value)"
        (focus)="onFocus()">
    </div>
  `,
  styles: [`
    div {
      display: flex;
    }
    input {
      border: none;
      background: none;
      padding: 0;
      outline: none;
      font: inherit;
      width: 100%;
      color: currentColor;
    }
  `],
  providers: [
    { provide: MatFormFieldControl, useExisting: CurrencyInputComponent },
    DecimalPipe
  ],
})
export class CurrencyInputComponent implements
  MatFormFieldControl<number>, OnDestroy, ControlValueAccessor, OnInit {
  static nextId = 0;
  private unsubscribe$ = new Subject<void>();
  currencyForm: FormGroup = this.fb.group({
    amount: null
  });

  @Input()
  get value(): number {
    return this.currencyForm.get('amount').value;
  }
  set value(val: number | null) {
    this.currencyForm.get('amount').setValue(val);
    this.stateChanges.next();
  }

  stateChanges = new Subject<void>();

  @HostBinding() id = `app-currency-input-${CurrencyInputComponent.nextId++}`;

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(plh: string) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  focused = false;

  get empty(): boolean {
    return this.value == null;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(req: boolean) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @ViewChild('amount') amountField: ElementRef;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.currencyForm.disable() : this.currencyForm.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  get errorState(): boolean {
    return this.currencyForm.touched && !this.currencyForm.valid;
  }

  controlType = 'app-currency-input';
  autofilled?: boolean;
  userAriaDescribedBy?: string;

  onChange = (amount: any) => { };
  onTouched = () => { };

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private fb: FormBuilder,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private decimalPipe: DecimalPipe) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    this.currencyForm.get('amount').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((amount: any) => {
      this.onChange(amount);
    });
  }

  ngOnInit(): void {
    const validators = this.ngControl.control.validator;
    this.currencyForm.get('amount').setValidators(validators ? validators : null);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef);
  }

  writeValue(amount: number): void {
    this.value = amount;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  focus(): void {
    this.amountField.nativeElement.focus();
  }

  setDescribedByIds(ids: string[]): void { }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  onBlur(value: string): void {
    const amount = this.toAmount(value);
    this.currencyForm.get('amount').setValue(this.decimalPipe.transform(amount, '.2-2'));
  }

  onFocus(): void {
    this.onTouched();
  }

  private toAmount(value: string): number {
    return (value) ? +(value.replace(/,/g, '')) : null;
  }
}
