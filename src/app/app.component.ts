import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent } from '@angular/router';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showSpinner = true;
  asyncLoadCount = 0;
  title = 'horizon';
  user: User;

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private authService: AuthService) {
    this.router.events.subscribe((event: RouterEvent): void => {
      if (event instanceof RouteConfigLoadStart) {
        this.asyncLoadCount++;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.asyncLoadCount--;
      }
      this.showSpinner = !!this.asyncLoadCount;
    });
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user: User) => {
      if (user) {
        this.user = user;
        this.authService.setUser(user);
      }
    });
  }

  onLogout(): void {
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
}
