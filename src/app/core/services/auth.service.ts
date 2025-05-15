import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private getLocalStorage(): Storage | null {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    const storage = this.getLocalStorage();
    if (storage) {
      storage.removeItem('auth_token');
      storage.removeItem('user');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const storage = this.getLocalStorage();
    return !!(storage && storage.getItem('auth_token'));
  }

  getToken(): string | null {
    const storage = this.getLocalStorage();
    return storage ? storage.getItem('auth_token') : null;
  }

  private setToken(token: string): void {
    const storage = this.getLocalStorage();
    if (storage) {
      storage.setItem('auth_token', token);
    }
    // Decodificar el token y poblar el usuario actual
    try {
      const payload = jwtDecode<JwtPayload>(token);
      // Buscar el rol en 'role' o en el claim estándar de roles
      const role = payload["role"] || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
      const user: User = {
        id: payload.id,
        username: payload.username,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        documentType: payload["documentType"] || '',
        documentNumber: payload["documentNumber"] || '',
        phoneNumber: payload["phoneNumber"] || '',
        role: role as any,
        status: payload["status"] || 'Active',
        createdAt: payload["createdAt"] ? new Date(payload["createdAt"]) : undefined,
        updatedAt: payload["updatedAt"] ? new Date(payload["updatedAt"]) : undefined
      };
      this.currentUserSubject.next(user);
    } catch (e) {
      this.currentUserSubject.next(null);
    }
  }

  private setSession(authResult: AuthResponse): void {
    // Ya no se usa, pero se deja por compatibilidad si algún otro método lo llama
    this.setToken(authResult.token);
  }

  private loadUserFromStorage(): void {
    const storage = this.getLocalStorage();
    if (!storage) return;
    const token = storage.getItem('auth_token');
    if (token) {
      this.setToken(token);
    }
  }
}

interface JwtPayload {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  [key: string]: any;
} 