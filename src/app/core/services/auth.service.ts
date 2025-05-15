import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
        tap(response => this.setSession(response))
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => this.setSession(response))
      );
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

  private setSession(authResult: AuthResponse): void {
    const storage = this.getLocalStorage();
    if (storage) {
      storage.setItem('auth_token', authResult.token);
      storage.setItem('user', JSON.stringify(authResult.user));
    }
    this.currentUserSubject.next(authResult.user as unknown as User);
  }

  private loadUserFromStorage(): void {
    const storage = this.getLocalStorage();
    if (!storage) return;
    const userStr = storage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error parsing stored user', e);
        this.logout();
      }
    }
  }
} 