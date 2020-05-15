import { Component, OnInit } from '@angular/core';
import { HeroService} from './hero.service';
import { Observable } from 'rxjs';
import { Hero } from './hero.model';


@Component({
  selector: 'hero-list',
  template: `
  <ul>
    <li *ngFor="let hero of heroes$ | async">{{hero.name}}</li>
  </ul>
  `,
  styles: ['']
})
export class HeroListComponent implements OnInit {
  heroes$ : Observable<Hero[]> = null

  constructor(private heroService: HeroService) {
  }
  
  ngOnInit() {
    this.heroes$   = this.heroService.getHeroes(); 
  }

}
