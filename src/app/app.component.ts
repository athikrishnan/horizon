import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent } from '@angular/router';
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private analytics: AngularFireAnalytics) {
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
}
