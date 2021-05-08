import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable()
export class SuperuserService {
  constructor(private store: AngularFirestore) {}

  getUsers(): Observable<User[]> {
    return this.store.collection<User>('users').valueChanges().pipe(
      map((response) => response.filter((user: User) => !user.isSuperuser)), take(5));
  }

  async deactivateUser(user: User): Promise<User> {
    user.isActive = false;
    await this.store.collection<User>('users').doc(user.uid).set(user);
    return new Promise(() => user);
  }

  async activateUser(user: User): Promise<User> {
    user.isActive = true;
    await this.store.collection<User>('users').doc(user.uid).set(user);
    return new Promise(() => user);
  }
}
