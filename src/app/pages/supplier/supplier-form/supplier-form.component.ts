import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Supplier } from 'src/app/models/supplier.model';
import { AlertService } from 'src/app/services/alert.service';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  supplierForm: FormGroup = this.fb.group({
    id: [''],
    name: [null, Validators.required],
    location: [null, Validators.required],
    gstin: [null, Validators.required],
    phone: [null, Validators.required],
    email: [null, Validators.email]
  });
  supplier: Supplier;
  editId: string;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private alertService: AlertService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (!!this.editId) {
      this.supplierService.getSupplier(this.editId).subscribe((supplier: Supplier) => {
        this.supplier = supplier;
        this.supplierForm.patchValue(supplier);
        this.showSpinner = false;
        this.ref.detectChanges();
      });
    } else {
      this.showSpinner = false;
    }

    this.supplierForm.get('email').valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(() => {
      this.supplierForm.get('email').markAsTouched();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSave(): void {
    this.showSpinner = true;
    let supplier: Supplier = this.supplierForm.getRawValue() as Supplier;

    if (this.supplier) {
      supplier = Object.assign(this.supplier, supplier);
    }

    this.supplierService.saveSupplier(supplier).then(() => {
      this.showSpinner = false;
      if (!this.editId) {
        this.router.navigate(['supplier']);
      }
      this.alertService.alert('Supplier saved');
      this.ref.detectChanges();
    });
  }

  onDelete(): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.supplierService.deleteSupplier(this.supplier).then(() => {
          this.alertService.alert('Supplier deleted');
          this.router.navigate(['supplier']);
        });
      }
    });
  }
}
