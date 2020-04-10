import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';

import { shareReplay, filter, tap, map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

export const ANONYMOUS_USER: User = {
  id: undefined, email: undefined, roles: []
};

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;

  constructor(private http: HttpClient) { }

  /* shareReplay
     We are calling shareReplay to prevent the receiver of this Observable
    from accidentally triggering multiple POST requests due to multiple subscriptions.
  */
  login(email: string, password: string) {
    return this.http.post<User>('/api/login', { email, password }).pipe(
      // tap(user => this.subject.next(user)));
      tap(res => this.setSession(res)),
      shareReplay()
    );
  }

  private setSession(authResult) {
    const tkn = JSON.parse(atob(authResult.accessToken.split('.')[1]));
    // const expiresAt = moment().add(authResult.expiresIn, 'second');
    console.log(atob(authResult.accessToken.split('.')[1]));
    // console.log(JSONmoment.unix(tkn.exp));
    localStorage.setItem('accessToken', authResult.accessToken);
    // json-server-auth token field exp contains epoch of exportation (last 1 hour)
    localStorage.setItem('expires_at', tkn.exp);
  }

  logout(): /* Observable<any> */ void {
    // No server logout for JWT
    // just remove token from local storage
    localStorage.removeItem('accessToken');
    console.log('AuthService.logout: accessToken removed');
    /*
    return this.http.post('/api/logout', null).pipe(
      shareReplay(),
      // tap(user => this.subject.next(ANONYMOUS_USER)));
      tap(user => this.user = ANONYMOUS_USER)
    );
    */
  }

  public isLoggedIn() {
    return moment().isBefore(moment.unix(+localStorage.getItem('expires_at')));
  }

  public isLoggedOut() { return !this.isLoggedIn(); }


}
