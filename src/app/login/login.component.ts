import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  userName: string;
  password: string;
  showPermissionIssue = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onLogin() {
    const successLogging = this.authService.login(this.userName, this.password);
    if (!successLogging) {
      this.showPermissionIssue = true;
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
