import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {}

  // isAuthenticated() {
  //   const promise = new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve(this.isLoggedIn);
  //     }, 800);
  //   });
  //   return promise;
  // }

  login(userName: string, password: string) {
    if (userName === 'admin' && password === '1234') {
      this.isLoggedIn.next(true);
      this.router.navigate(['/']);
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
