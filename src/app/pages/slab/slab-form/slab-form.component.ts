import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Slab } from 'src/app/models/slab.model';
import { SlabService } from 'src/app/services/slab.service';

@Component({
  selector: 'app-slab-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './slab-form.component.html',
  styleUrls: ['./slab-form.component.scss']
})
export class SlabFormComponent implements OnInit {
  showSpinner = true;
  slabForm: FormGroup = this.fb.group({
    id: null,
    createdAt: null,
    name: [null, Validators.required],
    hsn: [null, Validators.required],
    cgst: [null, Validators.required],
    sgst: [null, Validators.required]
  });
  @ViewChild('form') form: any;
  editId: string;
  slab: Slab;

  constructor(
    private fb: FormBuilder,
    private slabService: SlabService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (!!this.editId) {
      this.slabService.getSlab(this.editId).subscribe((slab: Slab) => {
        this.slab = slab;
        this.slabForm.patchValue(slab);
        this.showSpinner = false;
        this.ref.detectChanges();
      });
    } else {
      this.showSpinner = false;
    }
  }

  onSave(): void {
    this.showSpinner = true;
    const slab: Slab = this.slabForm.getRawValue() as Slab;
    this.slabService.saveSlab(slab).then(() => {
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
        this.slabService.deleteSlab(this.slab).then(() => {
          this.router.navigate(['slab']);
        });
      }
    });
  }
}
