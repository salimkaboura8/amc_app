import { Routes } from '@angular/router';
import { UserDashboard } from './user-dashboard/user-dashboard';
export const userRoutes: Routes = [
  {
    path: 'dashboard',
    component: UserDashboard,
  },
];
