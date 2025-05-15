import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    // Verificar si la ruta requiere un rol específico
    const requiredRole = route.data['role'];
    
    if (requiredRole) {
      // Obtener el usuario desde el localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && user.role === requiredRole) {
            return true;
          } else {
            // Redirigir a una página de acceso denegado
            router.navigate(['/access-denied']);
            return false;
          }
        } catch (e) {
          console.error('Error parsing stored user', e);
          router.navigate(['/auth/login']);
          return false;
        }
      }
    }
    
    return true;
  }
  
  // Redirigir al login si no está autenticado
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
}; 