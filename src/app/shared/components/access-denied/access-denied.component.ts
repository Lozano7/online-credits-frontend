import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [RouterLink, MaterialModule],
  template: `
    <div class="access-denied-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Acceso Denegado</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-icon color="warn" class="big-icon">block</mat-icon>
          <p>No tienes permisos para acceder a esta página.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/dashboard">Volver al Inicio</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: `
    .access-denied-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    
    mat-card {
      max-width: 400px;
      text-align: center;
      padding: 2rem;
    }
    
    .big-icon {
      font-size: 4rem;
      height: 4rem;
      width: 4rem;
      margin: 1rem 0;
    }
  `
})
export class AccessDeniedComponent {
} 