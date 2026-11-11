import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  name = '';
  email = '';
  password = '';
  submit(): void {
    this.auth.signIn(this.email, this.isRegister ? this.name : undefined);
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl'); //Reads the current URL's query parameters once and grabs the value of returnUrl
    this.router.navigateByUrl(returnUrl?.startsWith('/') ? returnUrl : '/dashboard');
    //Checks that returnUrl exists and verifies that it begins with a forward slash /
  }
}
