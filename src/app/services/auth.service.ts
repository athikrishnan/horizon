import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  authId: string;
  authUser: User;
  private user = new ReplaySubject<User>(1);
  user$ = this.user.asObservable();
  constructor(
    private store: AngularFirestore,
    private auth: AngularFireAuth) {
      this.init();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private init(): void {
    this.auth.onAuthStateChanged(async (authUser: User) => {
      if (authUser) {
        this.authId = authUser.uid;
        this.store.collection<User>('users').doc(authUser.uid).valueChanges().pipe(takeUntil(this.unsubscribe$))
          .subscribe((user: User) => this.publishAuth(user));
      }
    });
  }

  private publishAuth(user: User): void {
    this.authUser = user;
    this.user.next(user);
  }

  async login(): Promise<firebase.auth.UserCredential> {
    return this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(async () => {
      return await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    });
  }

  async logout(): Promise<void> {
    return await this.auth.signOut();
  }
}
