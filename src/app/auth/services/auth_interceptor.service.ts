import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/User';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // If the request header contains 'skip', bypass the interceptor
    if (req.headers.get('skip')) {
      return next.handle(req);
    }
    const user: User = this.userService.getCurrentUser();
    const userAccessToken = this.authService.getAccessToken();
    // If user access token is present
    if (userAccessToken) {
      const refreshTokenExpiry = this.authService.refreshTokenExpiry();
      const accessTokenExpiry = this.authService.accessTokenExpiry();
      // If the refresh token is about to expire, sign out the user
      if (refreshTokenExpiry <= 10) {
        this.authService.signout();
      }
      // If the access token is about to expire, refresh it  
      if (accessTokenExpiry <= 10) {
        return this.authService.refreshAccessToken().pipe(
          switchMap((res) => {
          console.log(res);
          const newAccessToken = res.data?.refreshAccessToken!;
          this.authService.setAccessToken(newAccessToken);
          // Clone the original request with the new access token
          const modifiedReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + newAccessToken),
          });

          return next.handle(modifiedReq);
        }),
        catchError((error) => {
          console.error('Error refreshing access token:', error);
          return throwError(error);
        })
      );
      }
      // If the access token is still valid, proceed with the original request
      else {
        const modifiedReq = req.clone({
          headers: req.headers.set(
            'Authorization',
            'Bearer ' + userAccessToken
          ),
        });
        return next.handle(modifiedReq);
      }
    }

    // If no user access token is present, proceed with the original request
    return next.handle(req);
  }
}
