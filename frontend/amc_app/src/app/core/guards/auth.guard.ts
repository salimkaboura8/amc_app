import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);

  const token = storage.getItem('auth_token');
  if (token) return true;

  router.navigate(['']);
  return false;
};
