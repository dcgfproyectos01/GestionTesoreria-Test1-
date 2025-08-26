import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  const expiresAt = auth.getExpiresAt();

  if (!token || !expiresAt) {
    auth.clearSession();
    router.navigate(['/login']);
    return false;
  }

  try {
    await firstValueFrom(auth.validateToken());
    return true;
  } catch {
    auth.clearSession();
    router.navigate(['/login']);
    return false;
  }
};
