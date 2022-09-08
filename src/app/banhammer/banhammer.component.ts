import { Component, OnInit } from '@angular/core';
import { faUserSlash, faBan, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Ban } from '../interfaces';
import { SearchType } from '../enums';

@Component({
  selector: 'app-banhammer',
  templateUrl: './banhammer.component.html',
  styleUrls: ['./banhammer.component.scss']
})
export class BanhammerComponent implements OnInit {

  constructor(
    private _api: ApiService,
  ) { }


  public searchForm: FormGroup = new FormGroup({
    searchType: new FormControl(SearchType.ANY),
    searchValue: new FormControl(),
  });

  public bans: Ban[];

  public searchTypes = [
    { id: SearchType.IP, val: 'IP' },
    { id: SearchType.CN, val: 'CN' },
    { id: SearchType.SERIALS, val: 'AS&SS' },
    { id: SearchType.DATE, val: 'Время' },
    { id: SearchType.ANY, val: 'Все' },
  ];

  public currentSearchType: number = SearchType.ANY;
  
  fa = {
    ban: faUserSlash,
    null: faBan,
    elipsis: faEllipsisV,
  };

  search(): Observable<Ban[]> | void {
    const searchForm = this.searchForm.value;
    switch(searchForm.searchType) {
      case SearchType.IP : {
        return this._api.getBansByIP(searchForm.searchValue);
      }
      case SearchType.CN : {
        return this._api.getBansByCN(searchForm.searchValue);
      }
      default: break;
    };
  }

  changeDate<T>(date: T): number {
    return Date.now();
  }

  onDateSelect(event, id: number) {
    /** Not inplemented */
  }

  private _bansDateTransform(bans: Ban[]): Ban[] {
    return bans.map((ban: Ban) => {
      ban.banned_from = new Date(ban.banned_from).valueOf();
      if (ban.banned_to) ban.banned_to = new Date(ban.banned_to).valueOf();
      return ban;
    });
  }

  getBansByCN(cn: string): void {
    this._api.getBansByCN(cn)
             .pipe(
              take(1),
              map(this._bansDateTransform));   
  }

  ngOnInit(): void {
  }

}
