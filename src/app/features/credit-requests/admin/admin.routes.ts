import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component.js').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'requests',
    loadComponent: () => import('./pages/request-list/admin-request-list.component.js').then(m => m.AdminRequestListComponent)
  },
  {
    path: 'requests/:id',
    loadComponent: () => import('./pages/request-detail/admin-request-detail.component.js').then(m => m.AdminRequestDetailComponent)
  },
  {
    path: 'audit',
    loadComponent: () => import('./pages/audit-log/audit-log.component.js').then(m => m.AuditLogComponent)
  }
]; 