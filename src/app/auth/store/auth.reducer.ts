import { createReducer, on, Action } from '@ngrx/store';

import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  isLoading: boolean;
}

export const initialState: State = {
  user: null,
  authError: null,
  isLoading: false,
};

export function authReducer(authState: State | undefined, authAction: Action) {
  return createReducer(
    initialState,
    on(AuthActions.loginStart, state => ({
      ...state,
      isLoading: true,
      authError: null,
    })),
    on(AuthActions.authenticateSuccess, (state, action) => ({
      ...state,
      user: action.user,
      isLoading: false,
      authError: null,
    })),
    on(AuthActions.authenticateFail, (state, action) => ({
      ...state,
      user: null,
      isLoading: false,
      authError: action.errorMessage,
    })),
    on(AuthActions.clearError, state => ({ ...state, authError: null })),
    on(AuthActions.logout, state => ({ ...state, user: null }))
  )(authState, authAction);
}
