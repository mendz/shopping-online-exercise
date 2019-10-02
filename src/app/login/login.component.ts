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
  minPasswordLength = 4;
  showPermissionIssue = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }

    this.loginForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.minPasswordLength),
      ]),
    });
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLogin(userName: string, password: string) {
    const successLogging = this.authService.login(userName, password);
    if (!successLogging) {
      this.showPermissionIssue = true;
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { userName, password } = this.loginForm.value;
      this.onLogin(userName, password);
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
