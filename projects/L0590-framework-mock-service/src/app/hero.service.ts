import { Injectable } from '@angular/core';
import { Hero } from './hero';

@Injectable()
export class HeroService {

  heroes: Hero[]  = [ { str: 'Bombasto' }, { str: 'Magenta' }, { str: 'Magma' }, { str: 'Tornado' }    ];

  constructor() { }

  getHeroes(): Hero[] { return this.heroes; }

}
