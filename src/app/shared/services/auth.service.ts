import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { BehaviorSubject, Subscription } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { UserService } from './user.service';
import { User } from '../models/User';
import { Apollo, MutationResult } from 'apollo-angular';
import {
  Forget_PASSWORD_MUTATION,
  REFRESH_ACCESS_TOKEN_MUTATION,
  REGISTER_MUTATION,
  RESET_PASSWORD_MUTATION,
  SEND_OTP_MAIL_MUTATION,
  SIGNIN_MUTATION,
  VERIFY_EMAIL_MUTATION,
} from '../gql/auth-gql';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  signedIn: boolean = false;
  subscriptions = new Subscription();

  constructor(
    private apollo: Apollo,
    private localStorage: LocalStorageService,
    private userService: UserService,
    private router:Router
  ) {}
  getAccessToken(): string {
    return this.localStorage.getItem('accessToken');
  }
  getRefreshToken(): string {
    return this.localStorage.getItem('refreshToken');
  }
  setAccessToken(accessToken: string) {
    this.localStorage.setItem('accessToken', accessToken);
  }
  setRefreshToken(refreshToken: string) {
    this.localStorage.setItem('refreshToken', refreshToken);
  }
  accessTokenExpiry() {
    let accessToken = jwtDecode(this.getAccessToken());
    return Math.floor((accessToken.exp! - Math.floor(Date.now() / 1000)) / 60);
  }
  refreshTokenExpiry() {
    let refreshToken = jwtDecode(this.getRefreshToken());
    return Math.floor((refreshToken.exp! - Math.floor(Date.now() / 1000)) / 60);
  }
  signup(
    userData: User & { password: string; cPassword: string }
  ): Observable<MutationResult<{ register: boolean }>> {
    return this.apollo.mutate<{ register: boolean }>({
      mutation: REGISTER_MUTATION,
      variables: {
        ...userData,
      },
      context: {
        headers: { skip: 'true' },
      },
    });
  }
  signin(
    email: string,
    password: string
  ): Observable<
    MutationResult<{
      login: {
        accessToken: string;
        refreshToken: string;
        user: User;
      };
    }>
  > {
    return this.apollo.mutate<{
      login: {
        accessToken: string;
        refreshToken: string;
        user: User;
      };
    }>({
      mutation: SIGNIN_MUTATION,
      variables: {
        email,
        password,
      },
      context: {
        headers: { skip: 'true' },
      },
    });
  }
  refreshAccessToken(): Observable<
    MutationResult<{ refreshAccessToken: string }>
  > {
    return this.apollo.mutate<{
      refreshAccessToken: string;
    }>({
      mutation: REFRESH_ACCESS_TOKEN_MUTATION,
      variables: {
        refreshToken: this.getRefreshToken(),
      },
    });
  }
  changeOrForgetPassword(
    email: string,
    newPassword: string,
    cNewPassword: string,
    currentPassword?: string, //only in change password
    OTP?: string|null //only in forget password
  ): Observable<MutationResult<{ resetPassword: boolean }>> {
    return this.apollo.mutate<{ resetPassword: boolean }>({
      mutation: OTP ? Forget_PASSWORD_MUTATION : RESET_PASSWORD_MUTATION,
      variables: {
        email,
        password: newPassword,
        cPassword: cNewPassword,
        currentPassword,
        code: OTP,
      },
      context: {
        headers: { skip: 'true' },
      },
    });
  }
  verifyEmailViaOTP(
    OTP: string,
    email: string
  ): Observable<MutationResult<{ verifyEmail: boolean }>> {
    return this.apollo.mutate<{ verifyEmail: boolean }>({
      mutation: VERIFY_EMAIL_MUTATION,
      variables: {
        code: OTP,
        email,
      },
      context: {
        headers: { skip: 'true' },
      },
    });
  }
  sendOTP(
    email: string,
    reason: 'reset_password' | 'verify_email'
  ): Observable<MutationResult<{ sendMail: boolean }>> {
    return this.apollo.mutate<{ sendMail: boolean }>({
      mutation: SEND_OTP_MAIL_MUTATION,
      variables: {
        reason,
        email,
      },
      context: {
        headers: { skip: 'true' },
      },
    });
  }
  signout() {
    this.signedIn = false;
    this.localStorage.clearAll();
    this.userService.userSignal.set(null);
    this.router.navigate(['/']);
    window.location.reload();
  }
}
