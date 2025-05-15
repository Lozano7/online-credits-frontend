import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MaterialModule } from '../../../../shared/material.module';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MaterialModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Iniciar Sesión</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="form-field-full">
              <mat-label>Nombre de usuario o email</mat-label>
              <input matInput formControlName="usernameOrEmail" autocomplete="username">
              <mat-error *ngIf="loginForm.get('usernameOrEmail')?.errors?.['required']">
                El nombre de usuario o email es requerido
              </mat-error>
            </mat-form-field>
            
            <mat-form-field class="form-field-full">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password" type="password" autocomplete="current-password">
              <mat-error *ngIf="loginForm.get('password')?.errors?.['required']">
                La contraseña es requerida
              </mat-error>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                <span *ngIf="!isLoading">Iniciar Sesión</span>
              </button>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <a mat-button routerLink="/auth/register">¿No tienes cuenta? Regístrate aquí</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: `
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: var(--background-color);
    }
    
    .login-card {
      max-width: 400px;
      width: 100%;
      padding: 2rem;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  
  loginForm: FormGroup = this.fb.group({
    usernameOrEmail: ['', Validators.required],
    password: ['', Validators.required]
  });
  
  isLoading = false;
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.notificationService.show('Inicio de sesión exitoso');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.show(error?.error?.message || 'Error en login');
        }
      });
    }
  }
} 