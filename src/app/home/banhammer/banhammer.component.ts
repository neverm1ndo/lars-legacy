import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '@lars/api/api.service';
import { BanRule } from '@lars/interfaces/bans.interfaces';
import { BehaviorSubject, Subject, Observable, merge, map, switchMap, iif, tap, filter } from 'rxjs';
import { BanType } from '@lars/enums/bans.enum';
import { FormGroup, FormControl } from '@angular/forms';

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

  private $reload: BehaviorSubject<null> = new BehaviorSubject(null);
  public $loading: BehaviorSubject<boolean> = new BehaviorSubject(true);
  
  public searchForm: FormGroup = new FormGroup({
    type: new FormControl(3),
    query: new FormControl(''),
  });

  private $formInput: Subject<{ type: number; query: string }> = new Subject(); 

  public $bans: Observable<BanRule[]> = 
    merge(
      this.$reload,
      this.$formInput
    ).pipe(
      tap(() => { this.$loading.next(true); }),
      map((value) => value ? value : this._searchQuery),
      switchMap(
        (value) => iif(() => value.query.length !== 0, 
          this._api.searchBans(this._searchQuery), 
          this._api.getBanList())
      ),
      tap(() => { this.$loading.next(false); })
    );
 
  private get _searchQuery() {
    return this.searchForm.value;
  }

  public searchTypes = [
    { id: 0, val: 'IP' },
    { id: 1, val: 'CN' },
    { id: 2, val: 'AS&SS' },
    { id: 3, val: 'Никнейм' },
    { id: 4, val: 'Код' },
    { id: 5, val: 'Админ' },
  ];

  fa = {
    ban: faUserSlash
  }

  public search(): void {
    this.$formInput.next(this._searchQuery);
  }

  ngOnInit(): void {
  }

}
