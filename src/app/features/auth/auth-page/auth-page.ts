import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; //NgForm is an Angular directive that represents and tracks the state, values, and validation of an entire HTML <form> in Template-Driven Forms
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-auth-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isRegister = this.route.snapshot.data['mode'] === 'register';
  // this.route.snapshot grabs a one-time, static picture of the current route at the exact moment the component is created
  name = '';
  email = '';
  password = '';
  validationMessage = '';
  submit(form: NgForm): void {
    this.validationMessage = '';

    const trimmedEmail = this.email.trim();
    const trimmedName = this.name.trim();

    if (
      form.invalid ||
      !trimmedEmail ||
      !this.password.trim() ||
      (this.isRegister && trimmedName.length < 2)
    ) {
      form.control.markAllAsTouched(); //marks every input field inside an Angular NgForm as "touched" so that validation error messages immediately appear on screen
      this.validationMessage = 'Enter a valid email and password to continue.';
      return;
    }

    this.auth.signIn(this.email, this.isRegister ? trimmedName : undefined);
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl'); //Reads the current URL's query parameters once and grabs the value of returnUrl
    this.router.navigateByUrl(returnUrl?.startsWith('/') ? returnUrl : '/dashboard');
    //Checks that returnUrl exists and verifies that it begins with a forward slash /
  }
}
