import {
  Component,
  ElementRef,
  Input,
  ChangeDetectionStrategy,
  Optional,
  Inject,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { IconsService } from "../icons.service";

@Component({
  selector: "lty-icon",
  template: "<ng-content></ng-content>",
  styleUrls: ["./icons.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconsComponent {
  private icon: SVGElement;

  @Input() set name(iconName: string) {
    if (this.icon) {
      this.element.nativeElement.removeChild(this.icon);
    }
    const svgTpl = this.ltyIcons.getIcon(iconName);
    this.icon = this.toSVG(svgTpl);
    this.element.nativeElement.appendChild(this.icon);
  }
  @Input() set anim(animation: string) {
    this.icon.classList.add(animation);
    this.element.nativeElement.appendChild(this.icon);
  }
  // @Input() set stroke(strokeType: number | boolean) {
  // };
  // @Input() set color(newColor: string) {
  //
  // };
  private toSVG(svgStr: string): SVGElement {
    const div: HTMLElement = this.document.createElement("div");
    div.innerHTML = svgStr;
    return (
      div.querySelector("svg") ||
      this.document.createElementNS("http://www.w3.org/200/svg", "path")
    );
  }

  constructor(
    private element: ElementRef,
    private ltyIcons: IconsService,
    @Optional() @Inject(DOCUMENT) private document: any,
  ) {}
}
