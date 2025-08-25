import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth-component/auth.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: AuthComponent, pathMatch: 'full' },
  {
    path: 'user',
    canActivate: [authGuard],
    loadChildren: () => import('./features/user/user.routes').then((m) => m.userRoutes),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
];
