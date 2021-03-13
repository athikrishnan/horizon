import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pack } from 'src/app/models/pack.model';
import { PackService } from 'src/app/services/pack.service';

@Component({
  selector: 'app-pack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pack.component.html',
  styleUrls: ['./pack.component.scss']
})
export class PackComponent implements OnInit {
  showSpinner = true;
  searchForm: FormGroup = this.fb.group({
    search: null
  });
  packs: Pack[] = [];

  constructor(
    private packService: PackService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.packService.getPacks().subscribe((packs: Pack[]) => {
      this.packs = packs;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }
}
