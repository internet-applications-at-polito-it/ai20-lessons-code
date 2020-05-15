import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hero } from './hero.model';
import { Observable } from 'rxjs';


@Injectable()
export class HeroService {
  heroesUrl = "https://my-json-server.typicode.com/internet-applications-at-polito-it/heroes-db/people";
  heroes = [];

  constructor(private http: HttpClient) { }

    getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl);
  }

}