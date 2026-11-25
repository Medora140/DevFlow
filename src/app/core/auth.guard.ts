import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router'; //functional route guard

import { AuthService } from './auth.service';

export const authGuard: CanActivateChildFn = (_childRoute, state) => {
  // If a user tries to access a protected sub-page, it checks if they are logged in. If they are logged in, it lets them through; if they are not, it redirects them to the login page while remembering exactly which page they were trying to visit.

  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login'], {  // cancels the current navigation and instructs the Angular Router to redirect the user to /login while attaching their intended destination as a query parameter.
    queryParams: { returnUrl: state.url },
  });
};
