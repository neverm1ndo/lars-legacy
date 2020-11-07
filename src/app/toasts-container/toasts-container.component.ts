import { Component, TemplateRef } from '@angular/core';

import { ToastService } from '../toast.service';
import { toast } from '../app.animations';


@Component({
  selector: 'app-toasts',
  templateUrl: './toasts-container.component.html',
  styleUrls: ['./toasts-container.component.scss'],
  host: {'[class.ngb-toasts]': 'true'},
  animations: [toast]
})
export class ToastsContainer {
  constructor(public toastService: ToastService) {}

  isTemplate(toast: any) { return toast.textOrTpl instanceof TemplateRef; }
}
