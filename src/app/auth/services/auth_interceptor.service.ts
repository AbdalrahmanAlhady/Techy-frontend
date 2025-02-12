import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshingToken: boolean = false;
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('cloudinary')) {
      return next.handle(req);
    }
    if (req.headers.get('skip')) {
      return next.handle(req);
    }

    const accessTokenExpiry = this.authService.accessTokenExpiry();
    const refreshTokenExpiry = this.authService.refreshTokenExpiry();
    console.log('accessTokenExpiry', accessTokenExpiry);
    console.log('refreshTokenExpiry', refreshTokenExpiry);
    if (refreshTokenExpiry <= 10) {
      console.log('Refresh token expired, signing out');
      this.authService.signout();
      return throwError(() => new Error('Session expired'));
    }

    if (accessTokenExpiry <= 10 && !this.isRefreshingToken) {
      return this.handleAccessTokenRefresh(req, next);
    }

    const accessToken = this.authService.getAccessToken();
    return next.handle(this.addTokenToRequest(req, accessToken)).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.handleAccessTokenRefresh(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handleAccessTokenRefresh(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isRefreshingToken) {
      return this.tokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenToRequest(req, token!)))
      );
    }

    this.isRefreshingToken = true;
    this.tokenSubject.next(null);

    return this.authService.refreshAccessToken().pipe(
      switchMap((res) => {
        const newAccessToken = res.data?.refreshAccessToken!;
        this.authService.setAccessToken(newAccessToken);
        this.tokenSubject.next(newAccessToken);
        return next.handle(this.addTokenToRequest(req, newAccessToken));
      }),
      catchError((error) => {
        console.error('Error refreshing access token:', error);
        this.authService.signout();
        return throwError(() => error);
      }),
      finalize(() => {
        this.isRefreshingToken = false;
      })
    );
  }

  private addTokenToRequest(
    req: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }
}
