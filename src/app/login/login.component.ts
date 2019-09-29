import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('form', { static: false }) loginForm: NgForm;
  userName: string;
  password: string;
  showPermissionIssue = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onLogin(userName: string, password: string) {
    const successLogging = this.authService.login(userName, password);
    if (!successLogging) {
      this.showPermissionIssue = true;
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.onLogin(username, password);
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
