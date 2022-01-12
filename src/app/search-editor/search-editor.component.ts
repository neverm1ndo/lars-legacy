import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { LogLine } from '../interfaces/app.interfaces';
import { ApiService } from '../api.service';
import { UserService } from '../user.service';
import { mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { lazy } from '../app.animations';

@Component({
  selector: 'app-search-editor',
  templateUrl: './search-editor.component.html',
  styleUrls: ['./search-editor.component.scss'],
  animations: [lazy]
})
export class SearchEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('wrapper') wrapper: ElementRef<any>;

  lines: number = 0;
  chunks: LogLine[][] = [];
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
    this.chunks = [];
    this.loading = true;
    this.lines = 0;
    this.router.navigate(['/home/search'], { queryParams: { query: query.query }})
  }

  refresh(): void {
    this.loading = true;
    this.api.refresh();
  }

  sync(): void {
    this.loading = true;
    this.lines = 0;
    this.chunks = [];
    this.api.refresh();
  }

  isBottom(): boolean {
    if (this.wrapper.nativeElement.scrollTop === this.wrapper.nativeElement.scrollHeight - this.wrapper.nativeElement.offsetHeight) {
      return true;
    }
    return false;
  }
  isTop(): boolean {
    if (this.wrapper.nativeElement.scrollTop === 0) {
      return true;
    }
    return false;
  }

  ngAfterViewInit(): void {
    this.scroll = fromEvent(this.wrapper.nativeElement, 'scroll')
    .pipe(
      debounceTime(1200)
    ).subscribe(() => {
      if (this.isBottom()) {
        if (this.lines % +this.user.getUserSettings().lineChunk == 0) {
          this.api.lazyUpdate(1);
        }
      }
    });
  }

  ngOnInit(): void {
    this.api.currentPage = 0;
    this.glfSubber.add(
    this.route.queryParams
    .pipe(tap(() => {
      this.loading = true;
      this.lines = 0;
      this.chunks = [];
    }))
    .pipe(mergeMap((params: Params) => this.api.getLogFile(params.query?params.query:'', '0', this.lim, this.filter)))
    .subscribe((lines: LogLine[]) => {
      this.loading = false;
      this.chunks.push(...[lines]);
      this.lines += lines.length;
    }));
  }
  ngOnDestroy(): void {
    if (this.glfSubber) {
      this.glfSubber.unsubscribe();
    }
  }
}
