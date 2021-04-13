import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class ProfileService {
  constructor(
    private store: AngularFirestore,
    private authService: AuthService) {}

  getProfile(): Observable<User> {
    const uid = this.authService.authId;
    return this.store.collection<User>('users').doc(uid).valueChanges().pipe(take(1));
  }

  updateProfile(user: User): Promise<void> {
    return this.store.collection<User>('users').doc(user.uid).set(user);
  }
}
