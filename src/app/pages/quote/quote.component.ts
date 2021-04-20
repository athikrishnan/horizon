import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { Quote } from 'src/app/models/quote.model';
import { QuoteService } from 'src/app/services/quote.service';

@Component({
  selector: 'app-quote',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showSpinner = true;
  activeQuotes: Quote[] = [];
  recentQuotes: Quote[] = [];

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private quoteService: QuoteService) { }

  ngOnInit(): void {
    combineLatest([
      this.quoteService.getActiveQuotes(),
      this.quoteService.getRecentQuotes()
    ]).subscribe(([active, recent]: [Quote[], Quote[]]) => {
      this.activeQuotes = active;
      this.recentQuotes = recent;
      this.showSpinner = false;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editQuote(id: string): void {
    this.router.navigate(['quote/' + id + '/view']);
  }
}
