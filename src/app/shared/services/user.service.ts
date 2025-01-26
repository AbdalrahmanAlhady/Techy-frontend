import { Injectable, signal } from '@angular/core';
import { User } from '../models/User';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userSignal = signal<User | null>(this.getCurrentUser());
  constructor(
    private localStorage: LocalStorageService
  ) {}

  getCurrentUser(): User {
    return  this.localStorage.getItem('user');
  }

  setCurrentUser(user: User) {
    this.localStorage.setItem('user', user);
    this.userSignal.set(user);
  }
}
