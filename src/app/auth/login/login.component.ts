import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../../auth/store/auth.actions';
import { User } from '../user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  minPasswordLength = 6;
  error: string = null;
  isLoading = false;
  private haveUser = false;
  private storeSub: Subscription;

  constructor(private router: Router, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.isLoading;
      this.error = authState.authError;
      this.haveUser = authState.user ? true : false;
    });

    if (this.haveUser) {
      this.router.navigate(['/']);
    }

    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.minPasswordLength),
      ]),
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLogin(email: string, password: string) {
    this.store.dispatch(AuthActions.loginStart({ email, password }));
    this.loginForm.reset();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.onLogin(email, password);
    }
  }

  onHandleError() {
    this.store.dispatch(AuthActions.clearError());
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}
