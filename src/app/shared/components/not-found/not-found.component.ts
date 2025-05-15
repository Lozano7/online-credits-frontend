import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MaterialModule],
  template: `
    <div class="not-found-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Página No Encontrada</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <h1 class="error-code">404</h1>
          <mat-icon color="warn" class="big-icon">error_outline</mat-icon>
          <p>La página que estás buscando no existe o ha sido removida.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/">Volver al Inicio</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: `
    .not-found-container {
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
    
    .error-code {
      font-size: 5rem;
      font-weight: bold;
      margin: 0.5rem 0;
      color: #f44336;
    }
    
    .big-icon {
      font-size: 3rem;
      height: 3rem;
      width: 3rem;
      margin: 0.5rem 0;
    }
  `
})
export class NotFoundComponent {
} 