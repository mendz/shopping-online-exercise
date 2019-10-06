import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  minPasswordLength = 6;
  showPermissionIssue = false;
  error: string = null;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.user.value) {
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
    this.isLoading = true;
    this.authService.login(email, password).subscribe(
      responseData => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      errorMessage => {
        this.isLoading = false;
        this.error = errorMessage;
        this.showPermissionIssue = true;
      }
    );

    this.loginForm.reset();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.onLogin(email, password);
    }
  }

  getColor() {
    if (!this.showPermissionIssue) {
      return 'green';
    } else {
      return 'red';
    }
  }
}
