import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";
import { LoginGuard } from "../guards/login.guard";

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingModule, ReactiveFormsModule],
  providers: [LoginGuard],
})
export class LoginModule {}
