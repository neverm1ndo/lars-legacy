import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { WebSocketService } from '@lars/ws/web-socket.service';
import { isUndefined } from 'lodash';

@Component({
  selector: 'app-serverlog-monitor',
  templateUrl: './serverlog-monitor.component.html',
  styleUrls: ['./serverlog-monitor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  // providers: [WebSocketService]
})
export class ServerlogMonitorComponent implements OnInit {
  @ViewChild('log', { static: true })
  logContainer: ElementRef<HTMLDivElement>;

  constructor(
    private ws: WebSocketService,
    private renderer: Renderer2,
    private zone: NgZone
  ) {}

  lines$ = this.ws.getServerLog();

  ngOnInit(): void {
    this.ws.connect();
    this.ws.send('join:monitor');
    this.zone.runOutsideAngular(() => {
      const showServerLog = (chunk: string | undefined): void => {
        if (!chunk) return;

        const lines: string[] = chunk.split('\n');

        const colorMap: { [alert: string]: [RegExp, string] } = {
          warning: [/\[Warning\]/, 'warn'],
          debug: [/\[debug\]/, 'debug'],
          error: [/\[Error\]/, 'error']
        };

        function colorizeWarnings(line: string) {
          // eslint-disable-next-line prefer-const, guard-for-in
          for (let alert in colorMap) {
            const [trigger, color] = colorMap[alert];
            if (trigger.test(line)) return color;
          }
          return undefined;
        }

        let index = 0;
        const colorizeChunk = (): void => {
          if (index < lines.length - 50) {
            setTimeout(colorizeChunk);
          }

          const res: HTMLSpanElement[] = [];

          do {
            const line = lines[index];

            if (isUndefined(line)) {
              break;
            }

            if (line.length === 0) {
              index++;

              continue;
            }

            const color = colorizeWarnings(line);

            const lineContainer: HTMLSpanElement = this.renderer.createElement('span');

            lineContainer.textContent = line + '\n';
            if (color) {
              lineContainer.classList.add('text-' + color);
            }

            res.push(lineContainer);

            index++;
          } while (index % 50 !== 0);

          if (res.length) {
            this.logContainer.nativeElement.append(...res);

            this.logContainer.nativeElement.parentElement.scrollTo({
              top: this.logContainer.nativeElement.scrollHeight,
              behavior: 'auto'
            });
          }
        };

        colorizeChunk();
      };

      this.lines$.subscribe((lines: string) => {
        showServerLog(lines);
      });
    });
  }
}
