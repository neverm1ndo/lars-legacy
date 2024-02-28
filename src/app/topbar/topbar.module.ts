import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibertyIconsModule } from '@lars/liberty-icons/liberty-icons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TopbarComponent } from './topbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DevServerControlsModule } from '@lars/dev-server-controls/dev-server-controls.module';
import { SharedModule } from '@lars/shared/shared.module';

@NgModule({
  declarations: [TopbarComponent],
  imports: [
    CommonModule,
    LibertyIconsModule,
    FontAwesomeModule,
    NgbModule,
    DevServerControlsModule,
    SharedModule
  ],
  exports: [TopbarComponent],
  providers: []
})
export class TopbarModule {}
