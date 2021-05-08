import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SuperuserGuard implements CanActivate {
  constructor(private authService: AuthService) { }

  canActivate(): boolean {
    const user = this.authService.authUser;
    return user && user.isSuperuser;
  }
}
