import { Component, OnInit, ViewChild, ElementRef, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ElectronService } from '../core/services';
import { faUsers, faServer, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'server-stat-graph',
  templateUrl: './server-stat-graph.component.html',
  styleUrls: ['./server-stat-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerStatGraphComponent implements OnInit {

  constructor(
    private electron: ElectronService,
    private zone: NgZone,
    private cfr: ChangeDetectorRef
  ) { }

  points: number[] = [];
  stat: any;

  fa = {
    users: faUsers,
    server: faServer,
    locked: faLock,
    unlocked: faLockOpen
  };

  @ViewChild('graphics') graphics: ElementRef<HTMLCanvasElement>;

  getServerInfo() {
    this.electron.ipcRenderer.on('server-info', (event: Electron.IpcRendererEvent, info: any) => {
      this.stat = info;
      this.points.push(info.players.online);
      this.zone.runOutsideAngular(() => {
        const ctx = this.graphics.nativeElement.getContext('2d');
        const height = 64;
        let offset = 0;
        const drawGrid = () => {
          ctx.fillStyle = '#ffffff60';
          ctx.fillText('0', 3, 64);
          ctx.fillText('64', 0, 7);
          for (let i = 1; i < 4; i++) {
              ctx.beginPath();
              ctx.moveTo(20, 64/4*i);
              ctx.lineTo(270, 64/4*i);
              ctx.strokeStyle = '#ffffff10';
              ctx.lineWidth = 1;
              ctx.closePath();
              ctx.stroke();
              ctx.fillText(String(64/4*(4 - i)), 0, 64/4*i + 3)
          }
        }
        if (offset >= 250) this.points.shift();
        ctx.clearRect(0, 0, 275, 64);
        ctx.beginPath();
        ctx.moveTo(20, height - this.points[0]);
        for (let i = 0; i < this.points.length; i++) {
          offset=10*i;
          ctx.lineTo(20 + offset, height - this.points[i]);
        }
        ctx.lineTo(20 + offset, height);
        ctx.lineTo(20, height)
        ctx.closePath();
        ctx.strokeStyle = '#f00';
        ctx.fillStyle = '#f00';
        ctx.stroke();
        ctx.fill();
        drawGrid();
      })
      this.cfr.detectChanges();
    })
  }

  ngOnInit(): void {
    this.getServerInfo();
  }

}
