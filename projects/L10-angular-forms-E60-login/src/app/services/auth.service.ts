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
      shareReplay(), 
      // tap(user => this.subject.next(user)));
      tap(user => this.user = user)
    );
  }

  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout(): Observable<any> {
    return this.http.post('/api/logout', null).pipe(
      shareReplay(),
      // tap(user => this.subject.next(ANONYMOUS_USER)));
      tap(user => this.user = ANONYMOUS_USER)
    );
  }


}
