import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastsContainer } from './toasts-container/toasts-container.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LibertyIconsModule } from '@lars/liberty-icons/liberty-icons.module';
import { ToastService } from '@lars/toast.service';

@NgModule({
  declarations: [ToastsContainer],
  imports: [CommonModule, NgbModule, FontAwesomeModule, LibertyIconsModule],
  exports: [ToastsContainer],
  providers: [ToastService]
})
export class ToastsModule {}
