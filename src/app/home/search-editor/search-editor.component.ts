import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { LogLine } from '@lars/interfaces/app.interfaces';
import { ApiService } from '@lars/api.service';
import { UserService, IUserSettings } from '@lars/user.service';
import { mergeMap, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, Params, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable, of, map, combineLatest, tap, filter, Subscription } from 'rxjs';
import { lazy } from '@lars/app.animations';
import { getProcessTranslation } from '@lars/shared/components/line-process/log-processes';
import { faGlobe, faSadTear, faFingerprint } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-editor',
  templateUrl: './search-editor.component.html',
  styleUrls: ['./search-editor.component.scss'],
  animations: [lazy],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchEditorComponent implements OnInit, OnDestroy {

  public $reloader: BehaviorSubject<null> = new BehaviorSubject(null);

  private _pageReciever: Subscription;

  private $currentPage: BehaviorSubject<number> = new BehaviorSubject(0);

  public $list: BehaviorSubject<LogLine[]> = new BehaviorSubject([]);

  public $limit: Observable<number> = of(this._user.getUserSettings()).pipe(map(({ lineChunk }: IUserSettings) => lineChunk));

  private _navigationUrlHistory: string[] = [];
  
  @HostListener('document:keyup', ['$event']) kbdNavigate(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape' : return void(this._navigateBack());
      default: return;
    };
  }

  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
  ) {
    const $filter = of(window.localStorage.getItem('filter'))
                                          .pipe(
                                             map((filter) => Object.keys(JSON.parse(filter)).filter((key: string) => filter[key])),
                                          );
    
    this._pageReciever = this._route.queryParams.pipe(
        switchMap(({ query, from, to, page }: Params) => combineLatest([
                                                    $filter.pipe(map((processFilter: any) => ({ query, from, to, processFilter, page }))),
                                                    this.$limit,
                                                  ])),
        tap(() => { this._clearList(); }),
        switchMap(([{ query, processFilter, from, to, page }, limit]) => this.$reloader.pipe(
                                                      switchMap(() => this.$currentPage),
                                                      switchMap((currentPage: number) => this._api.getLogFile(query || '', page ?? currentPage, limit, processFilter, { from, to }))
                                                    )),
        map((page: LogLine[]) => [...this.$list.value, ...page]),
    ).subscribe((lines: LogLine[]) => {
      this.$loading.next(false);
      this.$list.next(lines);
    });

    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects),
    ).subscribe({
      next: (url: string) => {
        if (this._navigationUrlHistory[this._navigationUrlHistory.length - 1] === url) return;
        this._navigationUrlHistory.push(url);
      }
    });
  }

  private _navigateBack(): void {
    const _back = () => {
      this._navigationUrlHistory.pop();
      this._location.back();
    };
    this._navigationUrlHistory.length > 1 ? _back() : null;
  }

  private _clearList(): void {
    this.$list.next([]);
  }

  public search({ query, from, to }: any): void {
    this._router.navigate(['/home/search'], {
      queryParams: {
        page: 0,
        query,
        from,
        to,
      }
    });
  }

  public fa = {
    globe: faGlobe,
    sad: faSadTear,
    fingerprint: faFingerprint,
  }

  public $loading: BehaviorSubject<boolean> = new BehaviorSubject(true);
  
  public isBanned(processname: any) {
    const banned = ['<disconnect/ban>', '<disconnect/kick>'];
    return banned.includes(processname);
  }

  public getProcessTranslation(processname: any) {
    return getProcessTranslation(processname);
  }

  public sync(): void {
    this._clearList();
    this.$loading.next(true);
    this.$reloader.next(null);
  }

  public lazyLoadChunk() {
    this.$currentPage.next(this.$currentPage.value + 1);
  }

  ngOnInit(): void {
    
  }
  
  ngOnDestroy(): void {
    this._pageReciever.unsubscribe();
  }
}
