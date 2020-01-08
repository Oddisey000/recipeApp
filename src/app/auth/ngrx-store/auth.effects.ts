import { Actions, ofType, Effect } from '@ngrx/effects';
import * as fromAuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from '../auth.model';
import { AuthService } from '../auth.service';

const authenticationData = {
  urlSignUp: environment.firebaseUrlSignUp + environment.firebaseAPIKey,
  urlLogIn: environment.firebaseUrlSignIn + environment.firebaseAPIKey
};

const handleAuthentication = (expiresIn: number, email: string, userID: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const userData = new AuthUser(email, userID, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(userData));
  return new fromAuthActions.Login({
    email: email,
    userID: userID,
    token: token,
    expirationDate: expirationDate,
    redirect: true
  });
};

const handleError = (error: HttpErrorResponse) => {
  let errorMessage: string = 'An unknown error occured!';

  if (!error.error || !error.error.error) {
    return of(new fromAuthActions.LoginFail(errorMessage));
  }

  switch(error.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email is already exists';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct';
      break;
  }
  
  return of(new fromAuthActions.LoginFail(errorMessage));
};

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(fromAuthActions.SIGNUP_SUCCESS),
    switchMap((signupData: fromAuthActions.SignupSuccess) => {
      return this.http.post<AuthResponseData>(
        authenticationData.urlSignUp,
        {
          email: signupData.payload.email,
          password: signupData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(response => {
          this.authService.setLogoutTimer(+response.expiresIn * 1000);
        }),
        map(response => {
        return handleAuthentication(+response.expiresIn, response.email, response.localId, response.idToken);
      }),
      catchError((error: HttpErrorResponse) => {
        return handleError(error);
      }));
    })
  );

  
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(fromAuthActions.LOGIN_START),
    switchMap((authData: fromAuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        authenticationData.urlLogIn,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(response => {
          this.authService.setLogoutTimer(+response.expiresIn * 1000);
        }),
        map(response => {
        return handleAuthentication(+response.expiresIn, response.email, response.localId, response.idToken);
      }),
      catchError((error: HttpErrorResponse) => {
        return handleError(error);
      }));
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(fromAuthActions.LOGIN),
    tap((authSuccess: fromAuthActions.Login) => {
      if (authSuccess.payload.redirect) this.router.navigate(['/']);
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(fromAuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      this.router.navigate(['/auth']);
      localStorage.removeItem('userData');
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(fromAuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      
      if (!userData) return { type: 'Dummy' };

      const loadedUser = new AuthUser(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (loadedUser.token) {
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        
        this.authService.setLogoutTimer(expirationDuration);
        
        return new fromAuthActions.Login({
          email: loadedUser.email,
          userID: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false
        });
      }
      
      return { type: 'Dummy' };
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService) {}
}