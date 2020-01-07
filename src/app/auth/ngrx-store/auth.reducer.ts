import { AuthUser } from '../auth.model';
import * as fromAuthActions from './auth.actions';

export interface State {
  user: AuthUser,
  authError: string,
  loading: boolean
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
}

export function AuthReducer(state = initialState, action: fromAuthActions.AuthActions) {
  switch (action.type) {
    case fromAuthActions.LOGIN:
      const user = new AuthUser(
        action.payload.email,
        action.payload.userID,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        authError: null,
        user: user,
        loading: false
      };
    
    case fromAuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };

    case fromAuthActions.LOGIN_START:
    case fromAuthActions.SIGNUP_SUCCESS:
      return {
        ...state,
        authError: null,
        loading: true
      };

    case fromAuthActions.LOGIN_FAIL:
      return {
        ...state,
        authError: action.payload,
        user: null,
        loading: false
      };

    case fromAuthActions.HANDLE_ERROR:
      return {
        ...state,
        authError: null
      };
    
    default:
      return state;
  }
}