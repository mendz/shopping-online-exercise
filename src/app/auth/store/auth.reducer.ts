import { createReducer, on, Action } from '@ngrx/store';
import { User } from '../user.model';

export interface State {
  user: User;
  authError: string;
  isLoading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  isLoading: false,
};

export function authReducer(authState: State | undefined, authAction: Action) {
  return createReducer(initialState)(authState, authAction);
}
