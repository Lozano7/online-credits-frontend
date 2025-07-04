import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component.js').then(m => m.DashboardComponent)
  }
]; 