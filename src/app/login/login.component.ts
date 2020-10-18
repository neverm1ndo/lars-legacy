import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  return: string = '';
  error: any;
  loading: boolean = false;
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  get email() { return this.loginForm.get('email') };
  get password() { return this.loginForm.get('password') };

  logIn() {
    this.loading = true;
    this.userService.loginUser(this.loginForm.value).subscribe(
      response => {
          this.loading = false;
          this.userService.user.next(response);
          this.router.navigate(['/home']);
        },
      error => {
        this.loading = false;
        this.error = error;
        console.error(error)
      });
  }

  ngOnInit(): void {
    this.userService.error.subscribe((error) => {
      this.error = error.status + ' ' + error.message;
    });
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ])
    });
  }
  ngOnDestroy() {
    this.userService.error.unsubscribe();
  }
}
