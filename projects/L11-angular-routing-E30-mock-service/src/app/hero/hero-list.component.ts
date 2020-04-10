import { Component, OnInit } from '@angular/core';
import { HeroService } from './hero.service';
import { Hero } from './hero';

@Component({
  selector: 'app-hero-list',
  template: `
  <h2>My Heroes</h2>
  <ul class="heroes">
  <li *ngFor="let hero of heroes">
    <!-- <a routerLink="/heroes/{{hero.id}}"> -->
      <span class="badge">{{hero.id}}</span> {{hero.name}}
    <!-- </a> -->
  </li>
  </ul>
`
})
export class HeroListComponent implements OnInit {
  heroes: Hero[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroes = this.getHeroes();
  }

  getHeroes(): Hero[] {
    return this.heroService.getHeroes();
  }

}
