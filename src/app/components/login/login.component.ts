import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showSpinner = true;

  constructor(
    private auth: AngularFireAuth,
    private router: Router) { }

  ngOnInit(): void {
    this.showSpinner = false;
  }

  onLogin(): void {
    this.showSpinner = true;
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => {
      this.router.navigate(['']);
    }).catch(() => this.showSpinner = false);
  }
}
