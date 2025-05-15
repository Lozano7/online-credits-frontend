import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CreditRequestStatus } from '../../../../../core/models/credit-request.model';
import { CreditRequestService } from '../../../../../core/services/credit-request.service';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule],
  template: `
    <div class="admin-dashboard-container">
      <mat-toolbar color="primary">
        <span>Panel de Administración</span>
        <span class="toolbar-spacer"></span>
        <button mat-button routerLink="/dashboard">
          <mat-icon>dashboard</mat-icon>
          Dashboard
        </button>
        <button mat-button (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          Cerrar sesión
        </button>
      </mat-toolbar>
      
      <div class="content-container">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Administración de Solicitudes</h1>
        </div>
        
        <div class="dashboard-stats">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-value">{{pendingCount}}</div>
              <div class="stat-label">Pendientes</div>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-value">{{approvedCount}}</div>
              <div class="stat-label">Aprobadas</div>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-value">{{rejectedCount}}</div>
              <div class="stat-label">Rechazadas</div>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-value">{{totalCount}}</div>
              <div class="stat-label">Total</div>
            </mat-card-content>
          </mat-card>
        </div>
        
        <div class="actions-container">
          <h2 class="section-title">Acciones Rápidas</h2>
          
          <div class="action-buttons">
            <button mat-raised-button color="primary" routerLink="/admin/requests">
              <mat-icon>list</mat-icon>
              Ver Todas las Solicitudes
            </button>
            
            <button mat-raised-button color="accent" routerLink="/admin/requests">
              <mat-icon>assignment</mat-icon>
              Solicitudes Pendientes
            </button>
            
            <button mat-raised-button color="warn" routerLink="/admin/audit">
              <mat-icon>history</mat-icon>
              Ver Logs de Auditoría
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .admin-dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    
    .content-container {
      flex: 1;
      padding: 2rem;
      background-color: var(--background-color);
    }
    
    .dashboard-header {
      margin-bottom: 2rem;
    }
    
    .dashboard-title {
      font-size: 2rem;
      margin: 0;
      color: var(--text-color);
    }
    
    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    
    .stat-card {
      text-align: center;
      padding: 1.5rem;
    }
    
    .stat-value {
      font-size: 3rem;
      font-weight: bold;
      color: var(--primary-color);
    }
    
    .stat-label {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }
    
    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      color: var(--text-color);
    }
    
    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
  `
})
export class AdminDashboardComponent implements OnInit {
  private creditRequestService = inject(CreditRequestService);
  
  pendingCount = 0;
  approvedCount = 0;
  rejectedCount = 0;
  totalCount = 0;
  
  ngOnInit(): void {
    this.loadStats();
  }
  
  loadStats(): void {
    this.creditRequestService.getAll().subscribe(requests => {
      this.totalCount = requests.length;
      this.pendingCount = requests.filter(r => r.status === CreditRequestStatus.PENDING).length;
      this.approvedCount = requests.filter(r => r.status === CreditRequestStatus.APPROVED).length;
      this.rejectedCount = requests.filter(r => r.status === CreditRequestStatus.REJECTED).length;
    });
  }
  
  logout(): void {
    // Llamar al servicio de autenticación para logout
  }
} 