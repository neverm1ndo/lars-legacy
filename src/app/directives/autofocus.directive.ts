import { Directive, AfterViewInit, ElementRef, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Directive({
  selector: "[toFocus]",
})
export class AutofocusDirective implements AfterViewInit {
  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private _document: any,
  ) {}

  ngAfterViewInit(): void {
    if (this._document.activeElement) this._document.activeElement.blur();
    this.elementRef.nativeElement.focus();
  }
}
