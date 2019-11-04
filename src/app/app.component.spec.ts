import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import * as fromAuth from './auth/store/auth.reducer';

import { AppComponent } from './app.component';
import { User } from './auth/user.model';

describe('AppComponent', () => {
  let store: MockStore<fromAuth.State>;
  const initialState = fromAuth.initialState;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatTabsModule],
      declarations: [AppComponent],
      providers: [provideMockStore({ initialState })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.get<Store<fromAuth.State>>(Store);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should not show the nav buttons if not logged in', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('nav')).not.toBeTruthy();
  });

  // TODO: check how to mock the change the store
  // it('should show the nav buttons if logged in', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   const compiled = fixture.debugElement.nativeElement;
  //   store.setState({
  //     user: new User('email', 'id', 'token', new Date()),
  //     authError: null,
  //     isLoading: false,
  //   });
  //   fixture.detectChanges();
  //   expect(compiled.querySelector('nav')).toBeTruthy();
  // });

  // it(`should have as title 'shopping-store'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('shopping-store');
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('shopping-store app is running!');
  // });
});
