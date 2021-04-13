import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showSpinner = true;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.showSpinner = false;
  }

  onLogin(): void {
    this.showSpinner = true;
    this.authService.login().then(() => {
      this.router.navigate(['']);
    }).catch(() => this.showSpinner = false);
  }
}
