import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, ChangeDetectionStrategy, Input } from '@angular/core';
import { ElectronService } from '@lars/core/services';
import { faUsers, faServer, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { AppConfig } from '@lars/../environments/environment';
import { ServerGameMode } from '@samp';
import { Observable, interval, switchMap, from, map, tap, Subscription, catchError, throwError } from 'rxjs';
import { PingResponse } from 'ping';

const PRIMARY: string = '#1271d6';
const WARN: string = '#f5d442';
const ERRORED: string = '#db2e42';

enum ServerState {
  ERROR,
  STOPED,
  REBOOTING,
  LIVE,
  LOADING
}

@Component({
  selector: 'server-stat-graph',
  templateUrl: './server-stat-graph.component.html',
  styleUrls: ['./server-stat-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerStatGraphComponent implements OnInit, OnDestroy {

  constructor(
    private _electron: ElectronService,
    private _zone: NgZone,
  ) { }

  @Input() status: ServerState;

  private _points: number[] = [];
  public $stat: Observable<ServerGameMode> = interval(5000).pipe(
    switchMap(() => from(this.getServerInfo()))
  );

  private subscriptions = new Subscription();

  private $ping: Observable<number | unknown> = interval(5000).pipe(
    switchMap(() => from(this._electron.ipcRenderer.invoke('ping', 'svr.gta-liberty.ru', {
      timeout: 100,
    }))),
    catchError((err) => err),
    map((ping: PingResponse) => ping.time !== 'unknown' ? ping.time : 900)
  );

  public fa: { [iconName: string]: IconDefinition } = {
    users: faUsers,
    server: faServer,
    locked: faLock,
    unlocked: faLockOpen
  };

  @ViewChild('graphics') graphics: ElementRef<HTMLCanvasElement>;

  private _getMaxExistingPoint(): number {
    return Math.max.apply(null, this._points);
  }

  private _pingServer(): Subscription {
      return this.$ping.subscribe({
        next: (ping: number) => {
          if (this.status == ServerState.REBOOTING || this.status == ServerState.STOPED) ping = 900;
          this._points.push(ping);
          this.drawGraphics();
        },
        error: () => {
          this._points.push(900);
          this.drawGraphics();
        }
      });
  }

  private _onInterval(value: number) {
    const intervals = [
      [512, 999],
      [128, 512],
      [64, 128],
      [32, 64],
      [0, 32]
    ];

    for(let [from, to] of intervals) {
      if (from < value && value <= to) return to;
    }
    return 999;
  }

  drawGraphics(): void {
    this._zone.runOutsideAngular(() => {
      const WHITE: string = '#afafaf';
      const MAX_VALUE: number = 64;
      const ctx: CanvasRenderingContext2D = this.graphics.nativeElement.getContext('2d');
      const height: number = MAX_VALUE;
      const width: number = 270;
      let offset: number = 0;
      /**
      * Draw graphics grid, max definition depends from max players
      **/
      let peak: number = this._getMaxExistingPoint();
      let top = this._onInterval(peak);

      const drawGrid = () => {
        const grid = new Path2D();
              ctx.strokeStyle = WHITE;
              ctx.lineWidth = 0.1;
        for (let i = 1; i < 4; i++) {
          const point = Math.ceil(MAX_VALUE/4*i);
          grid.moveTo(15, point);
          grid.lineTo(width, point);
          grid.moveTo(width/4*i, 0);
          grid.lineTo(width/4*i, height);
          grid.closePath();
          ctx.fillStyle = WHITE;
          ctx.fillText(String(Math.ceil(top/4*(4 - i))), 0, point + 4);
        }
        ctx.stroke(grid);
      };

      if (this._points.length >= 26) this._points.shift();
      ctx.clearRect(0, 0, 275, height);
      ctx.beginPath();

      const area: Path2D = new Path2D();

      area.moveTo(20, height - this._points[0]*(height/top));
      for (let i = 0; i < this._points.length; i++) {
        offset = 10*i;
        area.lineTo(20 + offset, height - this._points[i]*(height/top));
      }

      let color = PRIMARY;
      if (peak >= 64) color = WARN;
      if (peak >= 128) color = ERRORED;

      ctx.fillStyle = color;

      if (this.status === ServerState.STOPED) {
        
        ctx.fillStyle = ERRORED;
        ctx.fillText('SERVER IS DEAD', width/2 - 40, height/2 + 5);
      }

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke(area);
      drawGrid();
    });
  }

  async getServerInfo(): Promise<ServerGameMode> {
    const PORT: number = 7777;
    return this._electron.ipcRenderer.invoke('server-game-mode', new URL(AppConfig.api.main).host, PORT);
  }

  ngOnInit(): void {
    this.subscriptions.add(this._pingServer());
  }

  ngOnDestroy(): void {
     this.subscriptions.unsubscribe();
  }
}