import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { LogLine } from '@lars/interfaces/app.interfaces';
import { ApiService } from '@lars/api.service';
import { UserService, IUserSettings } from '@lars/user.service';
import { mergeMap, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BehaviorSubject, Observable, of, map, combineLatest } from 'rxjs';
import { lazy } from '@lars/app.animations';
import { getProcessTranslation } from '@lars/shared/components/line-process/log-processes';

@Component({
  selector: 'app-search-editor',
  templateUrl: './search-editor.component.html',
  styleUrls: ['./search-editor.component.scss'],
  animations: [lazy],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchEditorComponent implements OnInit, OnDestroy {

  public reloader$: BehaviorSubject<null> = new BehaviorSubject(null);

  public list$: Observable<LogLine[]>;

  private currentPage$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    const filter$ = of(window.localStorage.getItem('filter'))
                                          .pipe(
                                             map((filter) => Object.keys(JSON.parse(filter)).filter((key: string) => filter[key])),
                                          );
    const limit$: Observable<number> = of(this._user.getUserSettings()).pipe(map(({ lineChunk }: IUserSettings) => lineChunk));
    
    this.list$ = this._route.queryParams
                            .pipe(
                              mergeMap(({ query, from, to, page }: Params) => combineLatest([
                                                                          filter$.pipe(map((processFilter: any) => ({ query, from, to, processFilter, page }))),
                                                                          limit$,
                                                                        ])),
                              switchMap(([{ query, processFilter, from, to, page }, limit]) => this.reloader$.pipe(
                                                                            switchMap(() => this.currentPage$),
                                                                            switchMap((current: number) => this._api.getLogFile(query || '', page ?? current, limit, processFilter, { from, to }))
                                                                          )),
                            );
                              // map((logline: LogLine[]) => logline.map((line: LogLine) => {
                              //   line.process
                              // })));
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

  public refresh(): void {
    // this.loading = true;
    // this.api.refresh();
  }

  
  public isBanned(processname: any) {
    const banned = ['<disconnect/ban>', '<disconnect/kick>'];
    return banned.includes(processname);
  }

  public getProcessTranslation(processname: any) {
    return getProcessTranslation(processname);
  }

  public sync(): void {
    this.reloader$.next(null);
  }

  public lazyLoadChunk() {
    const val: number = this.currentPage$.value; 
    this.currentPage$.next(val + 1);
  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    // if (this.glfSubber) this.glfSubber.unsubscribe();
  }
}
