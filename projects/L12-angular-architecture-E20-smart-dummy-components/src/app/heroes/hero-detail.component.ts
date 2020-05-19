import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { switchMap } from 'rxjs/operators';

import { HeroService } from './hero.service';
import { Hero } from './hero';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
})
export class HeroDetailComponent {
  @Input() hero: Hero;

  @Output('save') saveHeroEmitter = new EventEmitter();

  @Output('back') goBackEmitter = new EventEmitter();

  constructor() { }
/*
  @Input('hero')
  set hero(hero: Hero) {
    this.hero = hero;
  }

  get hero(): Hero {
    return this.hero;
  }
*/

  saveHero(hero: Hero) {
    this.saveHeroEmitter.emit(hero);
  }

  goBack(): void {
    this.goBackEmitter.emit(); 
  }
}
