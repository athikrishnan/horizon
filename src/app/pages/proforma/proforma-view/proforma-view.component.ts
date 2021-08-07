import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Customer } from 'src/app/models/customer.model';
import { ProformaItem } from 'src/app/models/proforma-item.model';
import { Proforma } from 'src/app/models/proforma.model';
import { Product } from 'src/app/models/product.model';
import { ProformaService } from 'src/app/services/proforma.service';
import { StateChangedService } from 'src/app/services/state-changed.service';
import { ProformaPrintService } from '../proforma-print.service';
import { ProformaPrintComponent } from '../proforma-print/proforma-print.component';

@Component({
  selector: 'app-proforma-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proforma-view.component.html',
  styleUrls: ['./proforma-view.component.scss'],
  providers: [DecimalPipe]
})
export class ProformaViewComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  showProductSearch = false;
  proforma: Proforma;
  get customer(): Customer | null {
    return (!this.proforma) ? null : this.proforma.customer;
  }
  @ViewChild(ProformaPrintComponent) print: ProformaPrintComponent;
  discountForm: FormGroup = this.fb.group({
    discount: [null, [Validators.required, Validators.min(0.01), Validators.max(100)]]
  });

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private proformaService: ProformaService,
    private dialog: MatDialog,
    private router: Router,
    private stateChangedService: StateChangedService<Proforma>,
    private proformaPrintService: ProformaPrintService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    const proformaId: string = this.route.snapshot.paramMap.get('proformaId');
    this.proformaService.loadCurrentProforma(proformaId).pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged((a, b) => a && b && a.updatedAt === b.updatedAt)
    ).subscribe((proforma: Proforma) => {
      this.proforma = proforma;
      this.discountForm.patchValue({ discount: (this.proforma.discount || 0.01) });
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onDelete(): void {
    this.dialog.open(DeleteConfirmationComponent).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.showSpinner = true;
        this.ref.detectChanges();
        this.proformaService.deleteProforma(this.proforma).then(() => {
          this.router.navigate(['proforma']);
        });
      }
    });
  }

  onProductSearchOpen(): void {
    this.showProductSearch = true;
  }

  onProductSearchCancel(): void {
    this.showProductSearch = false;
  }

  isIncompleteItem(item: ProformaItem): boolean {
    return !(!!item && !!item.product && !!item.variant
      && !!item.quantity && !!item.price);
  }

  onProductSelect(product: Product): void {
    this.showProductSearch = false;
    this.proformaService.saveProformaItem(this.proforma, {
      product,
    } as ProformaItem);
  }

  onTaxStateChange(event: MatCheckboxChange): void {
    this.showSpinner = true;
    this.proforma.hideTax = !event.checked;
    this.stateChangedService.stateChanged(this.proforma);
    this.saveProforma();
  }

  private saveProforma(): void {
    this.proformaService.saveProforma(this.proforma).then(() => {
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  onDiscountStateChange(event: MatCheckboxChange): void {
    this.showSpinner = true;
    this.proforma.hasDiscount = event.checked;
    this.proforma.discount = (event.checked) ? (this.customer.discount || 0.01) : null;
    this.ref.detectChanges();
    if (this.proforma.hasDiscount) {
      this.discountForm.patchValue({ discount: (this.customer.discount || 0.01) });
    }
    this.saveProforma();
  }

  onSaveDiscount(): void {
    this.showSpinner = true;
    this.proforma.discount = +this.discountForm.get('discount').value;
    this.saveProforma();
  }

  getTaxableAmount(): number {
    return this.proforma.total - this.getTaxAmount();
  }

  getTaxAmount(): number {
    return this.proforma.totalCgst + this.proforma.totalSgst;
  }

  onComplete(): void {
    this.showSpinner = true;
    this.proforma.completedAt = Date.now();
    this.ref.detectChanges();
    this.stateChangedService.stateChanged(this.proforma);
    this.proformaService.saveProforma(this.proforma).then(() => {
      this.ref.detectChanges();
      this.showSpinner = false;
    });
  }

  onPrint(): void {
    this.proformaPrintService.print(this.proforma, this.print.content.nativeElement.innerHTML);
  }
}
