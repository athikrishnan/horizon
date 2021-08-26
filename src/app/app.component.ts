import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent } from '@angular/router';
import { AppUpdateService } from './app-update.service';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showSpinner = true;
  showAuthSpinner = true;
  isLoginPage = false;
  asyncLoadCount = 0;
  title = 'horizon';
  user: User;
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  @ViewChild('sidenav') sidenav: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private analytics: AngularFireAnalytics,
    private appUpdateService: AppUpdateService) {
    this.analytics.logEvent('app_start', { time: new Date() });
    this.router.events.subscribe((event: RouterEvent): void => {
      if (event instanceof RouteConfigLoadStart) {
        this.asyncLoadCount++;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.asyncLoadCount--;
      }
      this.showSpinner = !!this.asyncLoadCount;
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url === '/login';
      }
    });
    this.appUpdateService.checkForUpdates();
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user: User) => {
      this.user = user;
      this.showAuthSpinner = false;
    });
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['login']);
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 5)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        if (swipe === 'previous') {
          this.sidenav.open();
        } else {
          this.sidenav.close();
        }
      }
    }
  }
}
