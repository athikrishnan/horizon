import { Component } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showSpinner = true;
  asyncLoadCount = 0;
  title = 'horizon';

  constructor(router: Router) {
    router.events.subscribe((event: RouterEvent): void => {
      if (event instanceof RouteConfigLoadStart) {
        this.asyncLoadCount++;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.asyncLoadCount--;
      }
      this.showSpinner = !!this.asyncLoadCount;
    });
  }
}
