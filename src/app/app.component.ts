import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from './auth/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private activatedSubAuthLogin: Subscription;
  isLoggedIn = false;

  title = 'shopping-store';
  navLinks = [
    { path: '/products', label: 'Products' },
    { path: '/charts', label: 'Charts' },
  ];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.autoLogin();
    this.activatedSubAuthLogin = this.authService.user.subscribe(
      (user: User) => {
        this.isLoggedIn = !!user;
      }
    );
  }

  ngOnDestroy() {
    this.activatedSubAuthLogin.unsubscribe();
  }
}
