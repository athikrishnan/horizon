import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { Proforma } from 'src/app/models/proforma.model';
import { ProformaService } from 'src/app/services/proforma.service';

@Component({
  selector: 'app-proforma',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proforma.component.html',
  styleUrls: ['./proforma.component.scss']
})
export class ProformaComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  activeProformas: Proforma[] = [];
  recentProformas: Proforma[] = [];

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private proformaService: ProformaService) { }

  ngOnInit(): void {
    combineLatest([
      this.proformaService.getActiveProformas(),
      this.proformaService.getRecentProformas()
    ]).subscribe(([active, recent]: [Proforma[], Proforma[]]) => {
      this.activeProformas = active;
      this.recentProformas = recent;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editProforma(id: string): void {
    this.router.navigate(['proforma/' + id + '/view']);
  }
}
