import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { ReplaySubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authId: string;
  private user = new ReplaySubject<User>(1);
  user$ = this.user.asObservable();
  constructor(
    private auth: AngularFireAuth) {
    this.auth.onAuthStateChanged((user: User) => {
      if (user) {
        console.log(user);
        this.setUser(user);
      }
    });
  }

  setUser(user: User): void {
    this.authId = user.uid;
    this.user.next(this.getAppUser(user));
  }

  private getAppUser(authUser: User): User {
    return {
      uid: authUser.uid,
      email: authUser.email,
      phoneNumber: authUser.phoneNumber,
      displayName: authUser.displayName,
      photoURL: authUser.photoURL
    } as User;
  }

  async login(): Promise<firebase.auth.UserCredential> {
    this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  async logout(): Promise<void> {
    return await this.auth.signOut();
  }
}
