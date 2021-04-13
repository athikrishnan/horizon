import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private store: AngularFirestore,
    private authService: AuthService) {}

  async getProfile(): Promise<User> {
    const uid = this.authService.authId;
    const docRef = await this.store.collection<User>('users').doc(uid).get().toPromise();

    if (docRef.exists) {
      return docRef.data();
    } else {
      const user: User = await this.authService.user$.toPromise();
      await this.store.collection<User>('users').doc(uid).set(user);
      return user;
    }
  }

  updateProfile(user: User): Promise<void> {
    return this.store.collection<User>('users').doc(user.uid).set(user);
  }
}
