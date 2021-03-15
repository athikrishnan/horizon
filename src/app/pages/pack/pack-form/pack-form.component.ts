import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationComponent } from 'src/app/components/delete-confirmation/delete-confirmation.component';
import { Pack } from 'src/app/models/pack.model';
import { PackService } from 'src/app/services/pack.service';

@Component({
  selector: 'app-pack-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pack-form.component.html',
  styleUrls: ['./pack-form.component.scss']
})
export class PackFormComponent implements OnInit {
  showSpinner = true;
  packForm: FormGroup = this.fb.group({
    id: null,
    createdAt: null,
    name: [null, Validators.required],
    count: [null, Validators.required]
  });
  @ViewChild('form') form: any;
  editId: string;
  pack: Pack;

  constructor(
    private fb: FormBuilder,
    private packService: PackService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (!!this.editId) {
      this.packService.getPack(this.editId).subscribe((pack: Pack) => {
        this.pack = pack;
        this.packForm.patchValue(pack);
        this.showSpinner = false;
        this.ref.detectChanges();
      });
    } else {
      this.showSpinner = false;
    }
  }

  onSave(): void {
    this.showSpinner = true;
    const pack: Pack = this.packForm.getRawValue() as Pack;
    this.packService.savePack(pack).then(() => {
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
        this.packService.deletePack(this.pack).then(() => {
          this.router.navigate(['pack']);
        });
      }
    });
  }
}
