import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuditLog } from '../../../../../core/models/audit-log.model';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  template: `
    <div class="audit-log-container">
      <mat-toolbar color="primary">
        <button mat-icon-button routerLink="/admin">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Registro de Auditoría</span>
        <span class="toolbar-spacer"></span>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar</mat-label>
          <input matInput placeholder="Buscar por usuario, acción..." (keyup)="applyFilter($event)">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </mat-toolbar>
      
      <div class="content-container">
        <div class="table-container">
          <table mat-table [dataSource]="auditLogs" matSort class="mat-elevation-z8">
            <!-- Timestamp Column -->
            <ng-container matColumnDef="timestamp">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Fecha </th>
              <td mat-cell *matCellDef="let log"> {{log.timestamp | date:'dd/MM/yyyy HH:mm:ss'}} </td>
            </ng-container>
            
            <!-- User Column -->
            <ng-container matColumnDef="user">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Usuario </th>
              <td mat-cell *matCellDef="let log"> {{log.userName}} </td>
            </ng-container>
            
            <!-- Action Column -->
            <ng-container matColumnDef="action">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Acción </th>
              <td mat-cell *matCellDef="let log"> {{log.action}} </td>
            </ng-container>
            
            <!-- Entity Column -->
            <ng-container matColumnDef="entity">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Entidad </th>
              <td mat-cell *matCellDef="let log"> {{log.entityType}} #{{log.entityId}} </td>
            </ng-container>
            
            <!-- Details Column -->
            <ng-container matColumnDef="details">
              <th mat-header-cell *matHeaderCellDef> Detalles </th>
              <td mat-cell *matCellDef="let log">
                <button mat-icon-button color="primary" (click)="showDetails(log)">
                  <mat-icon>info</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          
          <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
          
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner></mat-spinner>
          </div>
          
          <div *ngIf="!isLoading && auditLogs.length === 0" class="empty-state">
            <mat-icon class="empty-icon">history</mat-icon>
            <p>No hay registros de auditoría disponibles</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .audit-log-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    
    .search-field {
      width: 300px;
      font-size: 14px;
      color: white;
    }
    
    ::ng-deep .search-field .mat-form-field-outline {
      color: rgba(255, 255, 255, 0.5);
    }
    
    ::ng-deep .search-field .mat-form-field-label {
      color: rgba(255, 255, 255, 0.7);
    }
    
    ::ng-deep .search-field .mat-input-element {
      color: white;
    }
    
    ::ng-deep .search-field .mat-icon {
      color: rgba(255, 255, 255, 0.7);
    }
    
    .content-container {
      flex: 1;
      padding: 2rem;
      background-color: var(--background-color);
      overflow-y: auto;
    }
    
    .table-container {
      position: relative;
      min-height: 400px;
    }
    
    .loading-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.7);
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 0;
      text-align: center;
    }
    
    .empty-icon {
      font-size: 4rem;
      height: 4rem;
      width: 4rem;
      margin-bottom: 1rem;
      color: var(--text-secondary);
    }
  `
})
export class AuditLogComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  displayedColumns: string[] = ['timestamp', 'user', 'action', 'entity', 'details'];
  isLoading = true;
  
  ngOnInit(): void {
    // Aquí cargaríamos los logs de auditoría desde un servicio
    // Por ahora, usaremos datos de ejemplo
    setTimeout(() => {
      this.auditLogs = [
        {
          id: 1,
          timestamp: new Date(),
          userId: '2',
          userName: 'Juan Analista',
          action: 'APPROVE_CREDIT',
          entityType: 'CreditRequest',
          entityId: 123,
          details: 'Aprobó solicitud de crédito por S/. 5,000'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 3600000),
          userId: '2',
          userName: 'Juan Analista',
          action: 'REJECT_CREDIT',
          entityType: 'CreditRequest',
          entityId: 124,
          details: 'Rechazó solicitud de crédito por historial crediticio insuficiente'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 86400000),
          userId: '3',
          userName: 'María Supervisora',
          action: 'UPDATE_USER',
          entityType: 'User',
          entityId: 5,
          details: 'Actualizó información de usuario'
        }
      ];
      this.isLoading = false;
    }, 1000);
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Aquí implementaríamos la lógica de filtrado
    console.log('Filtering by:', filterValue);
  }
  
  showDetails(log: AuditLog): void {
    // Aquí implementaríamos un diálogo para mostrar los detalles completos
    console.log('Log details:', log);
  }
} 