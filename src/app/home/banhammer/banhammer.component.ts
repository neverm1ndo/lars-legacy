import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '@lars/api.service';
import { BanRule } from '@lars/interfaces/bans.interfaces';
import { Observable, map } from 'rxjs';
import { BanType } from '@lars/enums/bans.enum';

@Component({
  selector: 'app-banhammer',
  templateUrl: './banhammer.component.html',
  styleUrls: ['./banhammer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BanhammerComponent implements OnInit {

  constructor(
    private _api: ApiService,
  ) { }

  public $bans: Observable<BanRule[]> = this._api.getBanList();

  public searchTypes = [
    { id: 0, val: 'IP' },
    { id: 1, val: 'CN' },
    { id: 2, val: 'AS&SS' },
    { id: 3, val: 'Никнейм' },
    { id: 4, val: 'Время' },
  ];

  public currentSearchType: number = 0;

  fa = {
    ban: faUserSlash
  }

  ngOnInit(): void {
  }

}
