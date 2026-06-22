import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../api/auth.service';

export function authGuard() {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  return true;
}
