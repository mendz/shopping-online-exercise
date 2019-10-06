import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

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
    this.activatedSubAuthLogin = this.authService.isLoggedIn.subscribe(
      (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      }
    );
  }

  ngOnDestroy() {
    this.activatedSubAuthLogin.unsubscribe();
  }
}
