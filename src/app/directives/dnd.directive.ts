import {
  Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener,
} from "@angular/core";

@Directive({
  selector: "[dnd]",
})
export class DndDirective {
  @HostBinding("class.fileover") fileOver: boolean;
  @Output() fileDropped = new EventEmitter<any>();
  @Input("path") path: string;

  @HostListener("dragover", ["$event"]) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  @HostListener("drop", ["$event"]) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit({ filelist: files, path: this.path });
    }
  }
}
