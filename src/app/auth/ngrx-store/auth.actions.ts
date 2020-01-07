import { Action } from '@ngrx/store';

export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';
export const LOGIN_START = '[Auth] Login Start';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const SIGNUP_SUCCESS = '[Auth] Signup Success';
export const SIGNUP_FAIL = '[Auth] Signup Fail';
export const HANDLE_ERROR = '[Auth] Handle Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class Login implements Action {
  readonly type = LOGIN;
  constructor(public payload: {
    email: string,
    userID : string,
    token: string,
    expirationDate: Date
  }) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}
export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: {email: string, password: string}) {}
}
export class LoginFail implements Action {
  readonly type = LOGIN_FAIL;
  constructor(public payload: string) {}
}
export class SignupSuccess implements Action {
  readonly type = SIGNUP_SUCCESS;
  constructor(public payload: {email: string, password: string}) {}
}
export class SignupFail implements Action {
  readonly type = SIGNUP_FAIL;
  constructor(public payload: string) {}
}
export class HandleError implements Action {
  readonly type = HANDLE_ERROR;
}
export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions = 
  Login
  | Logout 
  | LoginStart 
  | LoginFail 
  | SignupSuccess 
  | SignupFail 
  | HandleError
  | AutoLogin;