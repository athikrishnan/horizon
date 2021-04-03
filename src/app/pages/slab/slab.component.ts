import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Slab } from 'src/app/models/slab.model';
import { SlabService } from 'src/app/services/slab.service';

@Component({
  selector: 'app-slab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './slab.component.html',
  styleUrls: ['./slab.component.scss']
})
export class SlabComponent implements OnInit {
  showSpinner = true;
  searchForm: FormGroup = this.fb.group({
    search: null
  });
  slabs: Slab[] = [];

  constructor(
    private slabService: SlabService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.slabService.getSlabs().subscribe((slabs: Slab[]) => {
      this.slabs = slabs;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }
}
