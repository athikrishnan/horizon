import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuoteViewComponent } from './quote-view/quote-view.component';
import { QuoteComponent } from './quote.component';
import { NewQuoteComponent } from './new-quote/new-quote.component';

const routes: Routes = [
  {
    path: '',
    component: QuoteComponent
  },
  {
    path: 'new-quote',
    component: NewQuoteComponent
  },
  {
    path: ':quoteId/view',
    component: QuoteViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteRoutingModule { }
