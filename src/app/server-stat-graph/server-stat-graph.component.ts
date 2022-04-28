import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { ElectronService } from '../core/services';
import { faUsers, faServer, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { AppConfig } from '../../environments/environment';
import { ServerGameMode } from '../../../samp';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'server-stat-graph',
  templateUrl: './server-stat-graph.component.html',
  styleUrls: ['./server-stat-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerStatGraphComponent implements OnInit, OnDestroy {

  constructor(
    private electron: ElectronService,
    private zone: NgZone,
    private cfr: ChangeDetectorRef,
  ) { }

  @Input('players') set players(players: number) {
    if (!this.stat) return;
    this.stat.players.online = players;
    this.points.push(players);
    this.drawGraphics();
  }

  points: number[] = [];
  stat: ServerGameMode;

  timer: Subscription = interval(60000).subscribe(() => {
    this.players = this.stat.players.online;
  });

  fa: { [iconName: string]: IconDefinition } = {
    users: faUsers,
    server: faServer,
    locked: faLock,
    unlocked: faLockOpen
  };

  @ViewChild('graphics') graphics: ElementRef<HTMLCanvasElement>;

  getMaxExistingPoint(): number {
    return Math.max.apply(null, this.points);
  }

  drawGraphics(): void {
    this.zone.runOutsideAngular(() => {
      const WHITE: string = '#afafaf';
      const PRIMARY: string = '#fd7e14';
      const MAX_PLAYERS: number = 64;
      const ctx: CanvasRenderingContext2D = this.graphics.nativeElement.getContext('2d');
      const height: number = MAX_PLAYERS;
      let offset: number = 0;
      let top: number = 0;
      let maxPoint: number = this.getMaxExistingPoint();

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
        for (let i = 1; i < 25; i++) {
            grid.moveTo(270/10*i, 0);
            grid.lineTo(270/10*i, height);
            grid.closePath();
        }
        ctx.stroke(grid);
      };

      if (offset >= 250) this.points.shift();
      ctx.clearRect(0, 0, 275, height);
      ctx.beginPath();

      const area: Path2D = new Path2D();

      area.moveTo(20, height - this.points[0]*(height/top));
      for (let i = 0; i < this.points.length; i++) {
        offset = 10*i;
        area.lineTo(20 + offset, height - this.points[i]*(height/top));
      }
      area.lineTo(20 + offset, height);
      area.lineTo(20, height)
      area.closePath();
      ctx.strokeStyle = PRIMARY;
      ctx.fillStyle = PRIMARY;
      ctx.stroke(area);
      ctx.fill(area);
      drawGrid();
    });
    this.cfr.detectChanges();
  }

  async getServerInfo(): Promise<void> {
    const PORT: number = 7777;
    return this.electron.ipcRenderer.invoke('server-game-mode', new URL(AppConfig.api.main).host, PORT)
               .then((info: ServerGameMode) => {
                 this.stat = info;
                 this.points.push(info.players.online);
                 return Promise.resolve();
               });
  }

  ngOnInit(): void {
    this.getServerInfo()
        .then(() => {
          this.drawGraphics();
        });
  }

  ngOnDestroy(): void {
    this.timer.unsubscribe();
  }
}
