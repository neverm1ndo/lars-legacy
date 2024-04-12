import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@lars/app.module';
import { distinctUntilChanged, fromEvent } from 'rxjs';

@Injectable()
export class WindowsService {
  constructor(@Inject(WINDOW) private window: Window) {}

  private windows = new Map<string, Window>();

  isChildren() {
    return this.window.parent ? true : false;
  }

  get(name: string) {
    return this.windows.get(name);
  }

  open(name: string, url: string) {
    const windowToOpen = this.windows.get(name);
    if (windowToOpen && !windowToOpen.closed) return;

    const newWindow = this.window.open(url, name, 'minWidth=950');
    this.windows.set(name, newWindow);
  }

  close(name: string) {
    const windowToClose = this.windows.get(name);

    if (windowToClose) {
      windowToClose.close();
    }

    if (windowToClose.closed) {
      this.windows.delete(name);
    }
  }

  closeAll() {
    for (const win of this.windows.values()) {
      win.close();
    }
  }

  postMessage(name: string, event: Record<string, any>) {
    const destinationWindow = this.windows.get(name);

    if (!destinationWindow || destinationWindow.closed) return;

    destinationWindow.postMessage(event, this.window.origin);
  }

  getMessages() {
    return fromEvent(this.window, 'message').pipe(distinctUntilChanged());
  }
}
