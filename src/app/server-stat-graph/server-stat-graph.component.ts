import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { ElectronService } from '@lars/core/services';
import { faUsers, faServer, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { AppConfig } from '@lars/../environments/environment';
import { ServerGameMode } from '@samp';
import { Observable, interval, switchMap, from, map, tap } from 'rxjs';
import { PingResponse } from 'ping';

const PRIMARY: string = '#1271d6';
const ERRORED: string = '#db2e42';

@Component({
  selector: 'server-stat-graph',
  templateUrl: './server-stat-graph.component.html',
  styleUrls: ['./server-stat-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerStatGraphComponent implements OnInit {

  constructor(
    private _electron: ElectronService,
    private _zone: NgZone,
  ) { }

  private _points: number[] = [];
  private _color: string = PRIMARY;
  public $stat: Observable<ServerGameMode> = interval(10000).pipe(
    switchMap(() => from(this.getServerInfo()))
  );

  private $ping: Observable<number | unknown> = interval(5000).pipe(
    switchMap(() => from(this._electron.ipcRenderer.invoke('ping', 'svr.gta-liberty.ru', {
      timeout: 100,
    }))),
    map((ping: PingResponse) => ping.time || 999)
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

  private _pingServer(): void {
      this.$ping.subscribe({
        next: (ping: number) => {
          this._points.push(ping);
          this.drawGraphics();
        },
        error: () => {
          this._color = ERRORED;
          this._points.push(999);
          this.drawGraphics();
        }
      });
  }

  drawGraphics(): void {
    this._zone.runOutsideAngular(() => {
      const WHITE: string = '#afafaf';
      const MAX_PLAYERS: number = 64;
      const ctx: CanvasRenderingContext2D = this.graphics.nativeElement.getContext('2d');
      const height: number = MAX_PLAYERS;
      let offset: number = 0;
      let top: number = 0;
      let maxPoint: number = this._getMaxExistingPoint();

      if (maxPoint <= MAX_PLAYERS) top = MAX_PLAYERS;
      if (maxPoint <= 32) top = 32;
      if (maxPoint <= 10) top = 12;

      /**
      * Draw graphics grid, max definition depends from max players
      **/
      const drawGrid = () => {
        const grid = new Path2D();
              ctx.strokeStyle = WHITE;
              ctx.lineWidth = 0.1;
        for (let i = 1; i < 4; i++) {
            grid.moveTo(15, MAX_PLAYERS/4*i);
            grid.lineTo(270, MAX_PLAYERS/4*i);
            grid.closePath();
            ctx.fillStyle = WHITE;
            ctx.fillText(String(top/4*(4 - i)), 0, MAX_PLAYERS/4*i + 4);
        }
        for (let i = 1; i < 25; i++) { // FIXME
            grid.moveTo(270/10*i, 0);
            grid.lineTo(270/10*i, height);
            grid.closePath();
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
      ctx.strokeStyle = this._color;
      ctx.lineWidth = 3;
      ctx.fillStyle = this._color;
      ctx.stroke(area);
      drawGrid();
    });
  }

  async getServerInfo(): Promise<ServerGameMode> {
    const PORT: number = 7777;
    return this._electron.ipcRenderer.invoke('server-game-mode', new URL(AppConfig.api.main).host, PORT);
  }

  ngOnInit(): void {
    this._pingServer();
  }
}