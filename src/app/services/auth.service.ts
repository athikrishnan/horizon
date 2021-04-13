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
        const doc = await this.store.collection('users').doc(authUser.uid).get().toPromise();
        if (!doc.exists) {
          await this.store.collection('users').doc(authUser.uid).set(this.getAppUser(authUser));
        }
        this.store.collection<User>('users').doc(authUser.uid).valueChanges().pipe(takeUntil(this.unsubscribe$))
          .subscribe((user: User) => this.user.next(user));
      }
    });
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
    return this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    });
  }

  async logout(): Promise<void> {
    return await this.auth.signOut();
  }
}
