import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new ReplaySubject<User>(1);
  user$ = this.user.asObservable();
  constructor() {}

  setUser(user: User): void {
    this.user.next(user);
  }
}
