import { Component, OnInit } from '@angular/core';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../api.service';
import { take, map } from 'rxjs/operators';

enum BanType {
  CHEATING,
  BUG_ABUSE,
  ADS,
  PAUSING,
  DRIVEBY,
  REJECTED_NICKNAME,
  INSULT,
}

enum SearchType {
  IP,
  CN,
  SERIALS,
  DATE,
  ANY,
}

interface Ban {
  id: number;
  rule: string;
  ban_type: BanType,
  ip: string;
  serial_cn?: string;
  serial_as?: number;
  serial_ss?: string;
  user_id?: number;
  admin_id: number;
  banned_from: Date | number;
  banned_to?: Date | number; 
}

@Component({
  selector: 'app-banhammer',
  templateUrl: './banhammer.component.html',
  styleUrls: ['./banhammer.component.scss']
})
export class BanhammerComponent implements OnInit {

  constructor(
    private _api: ApiService
  ) { }


  public bans: Ban[];

  public searchTypes = [
    { id: SearchType.IP, val: 'IP' },
    { id: SearchType.CN, val: 'CN' },
    { id: SearchType.SERIALS, val: 'AS&SS' },
    { id: SearchType.DATE, val: 'Время' },
    { id: SearchType.ANY, val: 'Все' },
  ];

  public currentSearchType: number = 4;
  
  fa = {
    ban: faUserSlash
  }

  ngOnInit(): void {
    this._api.getBanList()
             .pipe(take(1))
             .pipe(map((bans: Ban[]) => {
              return bans.map((ban: Ban) => {
                ban.banned_from = new Date(ban.banned_from).valueOf();
                if (ban.banned_to) ban.banned_to = new Date(ban.banned_to).valueOf();
                return ban;
              });
             }))
             .subscribe((bans: Ban[]) => {
              this.bans = bans;
             });
  }

}
