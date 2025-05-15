import { Routes } from '@angular/router';

export const CREDIT_REQUESTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/list/credit-request-list.component.js').then(m => m.CreditRequestListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/form/credit-request-form.component.js').then(m => m.CreditRequestFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail/credit-request-detail.component.js').then(m => m.CreditRequestDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/form/credit-request-form.component.js').then(m => m.CreditRequestFormComponent)
  }
]; 