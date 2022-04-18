import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { ElectronService } from '../core/services';
import { faUsers, faServer, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { AppConfig } from '../../environments/environment';

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
    if (this.stat) {
      this.stat.players.online = players;
      this.points.push(players);
      this.draw();
    }
  }

  points: number[] = [];
  stat: any;

  // timer = interval(5000)
  // .pipe(filter((players: number) => this.points.length >= 25 && this.points[this.points.length - 1] == players))
  // .subscribe(() => { if (this.stat) { this.points.push(this.stat.players.online); this.draw(); }});

  fa = {
    users: faUsers,
    server: faServer,
    locked: faLock,
    unlocked: faLockOpen
  };

  @ViewChild('graphics') graphics: ElementRef<HTMLCanvasElement>;

  getMaxPoint() {
     return Math.max.apply(null, this.points);
  }
  draw() {
    this.zone.runOutsideAngular(() => {
      const ctx = this.graphics.nativeElement.getContext('2d');
      const height = 64;
      let offset = 0;
      let top = 0;
      let maxPoint = this.getMaxPoint();
      if (maxPoint <= 64) top = 64;
      if (maxPoint <= 32) top = 32;
      if (maxPoint <= 10) top = 12;

      const drawGrid = () => {
        const grid = new Path2D();
              ctx.strokeStyle = '#afafaf';
              ctx.lineWidth = 0.1;
        for (let i = 1; i < 4; i++) {
            grid.moveTo(15, 64/4*i);
            grid.lineTo(270, 64/4*i);
            grid.closePath();
            ctx.fillStyle = '#afafaf';
            ctx.fillText(String(top/4*(4 - i)), 0, 64/4*i + 4)
        }
          for (let i = 1; i < 25; i++) {
            grid.moveTo(270/10*i, 0);
            grid.lineTo(270/10*i, height);
            grid.closePath();
        }
         ctx.stroke(grid);
      }
      if (offset >= 250) this.points.shift();
      ctx.clearRect(0, 0, 275, height);
      ctx.beginPath();
      const area = new Path2D();
      area.moveTo(20, height - this.points[0]*(height/top));
      for (let i = 0; i < this.points.length; i++) {
        offset=10*i;
        area.lineTo(20 + offset, height - this.points[i]*(height/top));
      }
      area.lineTo(20 + offset, height);
      area.lineTo(20, height)
      area.closePath();
      ctx.strokeStyle = '#fd7e14';
      ctx.fillStyle = '#fd7e14';
      ctx.stroke(area);
      ctx.fill(area);
      drawGrid();
    })
    this.cfr.detectChanges();
  }

  async getServerInfo() {
    return this.electron.ipcRenderer.invoke('server-game-mode', new URL(AppConfig.api.main).host, 7777).then((info) => {
      this.stat = info;
      this.points.push(info.players.online);
      return Promise.resolve();
    });
  }

  ngOnInit(): void {
    this.getServerInfo().then(() => {
      this.draw();
    });
  }
  ngOnDestroy(): void {
    // this.timer.unsubscribe();
  }

}
