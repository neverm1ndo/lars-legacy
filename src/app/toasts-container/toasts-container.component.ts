import { Component, TemplateRef } from "@angular/core";

import { IToast, ToastService } from "@lars/toast.service";
import { toast, upfade } from "@lars/app.animations";

@Component({
  selector: "app-toasts",
  templateUrl: "./toasts-container.component.html",
  styleUrls: ["./toasts-container.component.scss"],
  host: { "[class.ngb-toasts]": "true" },
  animations: [upfade, toast],
})
export class ToastsContainer {
  constructor(public service: ToastService) {}

  public isTemplate(toast: IToast) {
    return toast.body instanceof TemplateRef;
  }
}
