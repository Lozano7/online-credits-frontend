import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CreditRequest } from '../../../../core/models/credit-request.model';
import { User, UserRole } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { CreditRequestService } from '../../../../core/services/credit-request.service';
import { MaterialModule } from '../../../../shared/material.module';
import { CreditRequestListComponent } from '../../../credit-requests/pages/list/credit-request-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule, CreditRequestListComponent],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary">
        <span>Créditos Online</span>
        <span class="toolbar-spacer"></span>
        <span *ngIf="user">{{ user.firstName }} {{ user.lastName }}</span>
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Cerrar sesión</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <div class="dashboard-content">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Dashboard</h1>
        </div>

        <div class="dashboard-cards">
          <mat-card class="dashboard-card" *ngIf="isClient">
            <mat-card-header>
              <mat-icon mat-card-avatar>credit_card</mat-icon>
              <mat-card-title>Mis Solicitudes</mat-card-title>
              <mat-card-subtitle>{{ myCreditRequests.length }} solicitudes</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Administra tus solicitudes de crédito</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button routerLink="/credit-requests">VER SOLICITUDES</button>
              <button mat-raised-button color="primary" routerLink="/credit-requests/new">NUEVA SOLICITUD</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="dashboard-card" *ngIf="isAnalyst">
            <mat-card-header>
              <mat-icon mat-card-avatar>assignment</mat-icon>
              <mat-card-title>Solicitudes Pendientes</mat-card-title>
              <mat-card-subtitle>{{ pendingRequests.length }} por revisar</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Revisa y evalúa las solicitudes pendientes</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary" routerLink="/admin/requests">REVISAR SOLICITUDES</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="dashboard-card" *ngIf="isAnalyst">
            <mat-card-header>
              <mat-icon mat-card-avatar>analytics</mat-icon>
              <mat-card-title>Logs de Auditoría</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Consulta los logs de actividad del sistema</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button routerLink="/admin/audit">VER LOGS</button>
            </mat-card-actions>
          </mat-card>
        </div>

        <div *ngIf="isClient" class="dashboard-table-section">
          <h2 class="dashboard-table-title">Historial de Solicitudes</h2>
          <app-credit-request-list></app-credit-request-list>
        </div>
      </div>
    </div>
  `,
  styles: `
    .dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    
    .dashboard-content {
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
    
    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .dashboard-card {
      height: 100%;
    }
    
    .mat-mdc-card-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--primary-color);
      color: white;
    }

    .dashboard-table-section {
      margin-top: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      padding: 2rem;
    }
    .dashboard-table-title {
      font-size: 1.3rem;
      margin-bottom: 1.5rem;
      color: var(--text-color);
    }
  `
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private creditRequestService = inject(CreditRequestService);
  private router = inject(Router);
  
  user: User | null = null;
  myCreditRequests: CreditRequest[] = [];
  pendingRequests: CreditRequest[] = [];
  
  get isClient(): boolean {
    return this.user?.role === UserRole.SOLICITANTE;
  }
  
  get isAnalyst(): boolean {
    return this.user?.role === UserRole.ANALISTA;
  }
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      
      if (this.user) {
        if (this.isClient) {
          this.loadClientDashboard();
        } else if (this.isAnalyst) {
          this.loadAnalystDashboard();
        }
      }
    });
  }
  
  private loadClientDashboard(): void {
    this.creditRequestService.getMyCreditRequests().subscribe(
      requests => this.myCreditRequests = requests
    );
  }
  
  private loadAnalystDashboard(): void {
    // En un caso real, aquí cargaríamos solicitudes pendientes desde el servicio
    this.pendingRequests = [];
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
} 