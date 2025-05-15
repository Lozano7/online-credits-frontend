import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MaterialModule],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Registro de Usuario</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field class="form-field-half">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="firstName">
                <mat-error *ngIf="registerForm.get('firstName')?.errors?.['required']">
                  El nombre es requerido
                </mat-error>
              </mat-form-field>
              
              <mat-form-field class="form-field-half">
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="lastName">
                <mat-error *ngIf="registerForm.get('lastName')?.errors?.['required']">
                  El apellido es requerido
                </mat-error>
              </mat-form-field>
            </div>
            
            <mat-form-field class="form-field-full">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
              <mat-error *ngIf="registerForm.get('email')?.errors?.['required']">
                El email es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.errors?.['email']">
                Ingrese un email válido
              </mat-error>
            </mat-form-field>
            
            <mat-form-field class="form-field-full">
              <mat-label>Nombre de usuario</mat-label>
              <input matInput formControlName="username">
              <mat-error *ngIf="registerForm.get('username')?.errors?.['required']">
                El nombre de usuario es requerido
              </mat-error>
            </mat-form-field>
            
            <div class="form-row">
              <mat-form-field class="form-field-half">
                <mat-label>Tipo de documento</mat-label>
                <mat-select formControlName="documentType">
                  <mat-option value="DNI">DNI</mat-option>
                  <mat-option value="Pasaporte">Pasaporte</mat-option>
                  <mat-option value="CE">Carnet Extranjería</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field class="form-field-half">
                <mat-label>Número de documento</mat-label>
                <input matInput formControlName="documentNumber">
              </mat-form-field>
            </div>
            
            <mat-form-field class="form-field-full">
              <mat-label>Teléfono</mat-label>
              <input matInput formControlName="phoneNumber">
            </mat-form-field>
            
            <mat-form-field class="form-field-full">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password" type="password">
              <mat-error *ngIf="registerForm.get('password')?.errors?.['required']">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.errors?.['minlength']">
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                <span *ngIf="!isLoading">Registrarse</span>
              </button>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <a mat-button routerLink="/auth/login">¿Ya tienes cuenta? Iniciar sesión</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: `
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem 0;
      background-color: var(--background-color);
    }
    
    .register-card {
      max-width: 600px;
      width: 100%;
      padding: 2rem;
    }
    
    .form-row {
      display: flex;
      gap: 1rem;
    }
    
    .form-field-half {
      width: 50%;
    }
    
    .form-field-full {
      width: 100%;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    documentType: ['DNI'],
    documentNumber: [''],
    phoneNumber: [''],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  isLoading = false;
  
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en registro:', error);
          // Aquí se manejaría el error, por ejemplo mostrando un snackbar
        }
      });
    }
  }
} 