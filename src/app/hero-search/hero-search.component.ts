import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService,private messageService: MessageService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
    this.log('entra1');
  }

  ngOnInit(): void {
    this.log("Entra0");
    this.heroes$ = this.searchTerms.pipe(
      tap(_ => this.log('entra2')),
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

}
