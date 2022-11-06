import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { LogLine } from '@lars/interfaces/app.interfaces';
import { ApiService } from '@lars/api.service';
import { UserService } from '@lars/user.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { lazy } from '@lars/app.animations';

@Component({
  selector: 'app-search-editor',
  templateUrl: './search-editor.component.html',
  styleUrls: ['./search-editor.component.scss'],
  animations: [lazy]
})
export class SearchEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('wrapper') wrapper: ElementRef<any>;

  lines: number = 0;
  chunks: LogLine[][] = [[]];
  scroll: any;
  glfSubber: Subscription = new Subscription();
  filter: any;
  loading: boolean = true;
  lim: string = String(this.user.getUserSettings().lineChunk);

  constructor(
    public api: ApiService,
    public user: UserService,
    public route: ActivatedRoute,
    private router: Router,
  ) {
    const userFilter = JSON.parse(window.localStorage.getItem('filter'));
    this.filter = Object.keys(userFilter).filter((key: string) => userFilter[key] === false);
  }

  search(query: any): void {
    this.chunks = [[]];
    this.loading = true;
    this.lines = 0;
    this.router.navigate(['/home/search'], { queryParams: { query: query.query, from: query.from, to: query.to }})
  }

  refresh(): void {
    this.loading = true;
    this.api.refresh();
  }

  sync(): void {
    this.loading = true;
    this.lines = 0;
    this.chunks = [[]];
    this.api.refresh();
  }

  isBottom(): boolean {
    if (this.wrapper.nativeElement.scrollTop === this.wrapper.nativeElement.scrollHeight - this.wrapper.nativeElement.offsetHeight) {
      return true;
    }
    return false;
  }
  isTop(): boolean {
    if (this.wrapper.nativeElement.scrollTop === 0) return true;
    return false;
  }



  ngAfterViewInit(): void {
    this.scroll = fromEvent(this.wrapper.nativeElement, 'scroll')
    .pipe(
      debounceTime(1200)
    ).subscribe(() => {
      if (!this.isBottom()) return;
      if (this.lines % +this.user.getUserSettings().lineChunk == 0) this.api.lazyUpdate(1);
    });
  }

  ngOnInit(): void {
    this.api.currentPage = 0;
    this.glfSubber.add(
    this.route.queryParams
    .pipe(tap((params: Params) => {
      if (this.api.currentPage === 0) {
        this.loading = true;
        this.lines = 0;
        this.chunks = [[]];
      }
      if (params.query !== this.api.currentQuery) this.sync();
    }))
    .pipe(switchMap((params: Params) => this.api.getLogFile(params.query?params.query:'', this.lim, this.filter, { from: params.from, to: params.to })))
    .subscribe((lines: LogLine[]) => {
      this.loading = false;
      this.api.lazy = false;
      if (this.chunks.length > 5) this.chunks.shift();
      if (this.chunks[0].length == 0) this.chunks = [];
      this.chunks.push(...[lines]);
      this.lines += lines.length;
    }));
  }
  ngOnDestroy(): void {
    if (this.glfSubber) this.glfSubber.unsubscribe();
  }
}