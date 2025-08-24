import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth-component/auth.component';

export const routes: Routes = [
  { path: '', component: AuthComponent, pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.routes').then((m) => m.userRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
];
