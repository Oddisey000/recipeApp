import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { AuthUser } from './auth.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUser = new BehaviorSubject<AuthUser>(null);
  key: string = 'AIzaSyBLreT5_driHfJClQTVtXAxyJCKZp2RAhg';
  urlSignUp: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.key;
  urlLogIn: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +this.key;

  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      this.urlSignUp, 
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(catchError(this.errorHandler)
    ,tap(responseData => {
      this.handleAuthentication(
        responseData.email,
        responseData.localId,
        responseData.idToken,
        +responseData.expiresIn
      );
    }));
  }

  logIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      this.urlLogIn, 
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(catchError(this.errorHandler)
    ,tap(responseData => {
      this.handleAuthentication(
        responseData.email,
        responseData.localId,
        responseData.idToken,
        +responseData.expiresIn
      );
    }));
  }

  logOut() {
    this.authUser.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userdata');

    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userdata'));

    if (!userData) return;

    const loadedUser = new AuthUser(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      const expirationDuration = (
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      );

      this.authUser.next(loadedUser);
      this.autoLogOut(expirationDuration);
    }
  }

  autoLogOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    },expirationDuration);
  }

  private errorHandler(error: HttpErrorResponse) {
    let errorMessage: string = 'An unknown error occured!';

    if (!error.error || !error.error.error) {
      return throwError(errorMessage);
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
    
    return throwError(errorMessage);
  }

  private handleAuthentication(
    email: string, 
    userId: string, 
    token: string, 
    expiresIn: number) {
      const expirationDate = new Date(
        new Date().getTime() + expiresIn * 1000);
      const authUser = new AuthUser(email, userId, token, expirationDate);
      
      localStorage.setItem('userdata', JSON.stringify(authUser));
      this.authUser.next(authUser);
      this.autoLogOut(expiresIn * 1000);
  }
}
