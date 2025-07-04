import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router, RouterLink } from '@angular/router';
import { CreditRequest } from '../../../../core/models/credit-request.model';
import { CreditRequestService } from '../../../../core/services/credit-request.service';
import { MaterialModule } from '../../../../shared/material.module';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-credit-request-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule, MatButtonToggleModule, FormsModule],
  template: `
    <div class="credit-list-container">
      <mat-toolbar color="primary">
        <button mat-icon-button routerLink="/dashboard">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Mis Solicitudes de Crédito</span>
        <span class="toolbar-spacer"></span>
        <button mat-raised-button color="accent" routerLink="/credit-requests/new">
          <mat-icon>add</mat-icon>
          Nueva Solicitud
        </button>
      </mat-toolbar>
      
      <div class="content-container">
        <div class="status-filter">
          <mat-button-toggle-group [(ngModel)]="selectedStatus" (change)="filterByStatus()">
            <mat-button-toggle value="all">Todas</mat-button-toggle>
            <mat-button-toggle value="Pendiente">Pendientes</mat-button-toggle>
            <mat-button-toggle value="Aprobado">Aprobadas</mat-button-toggle>
            <mat-button-toggle value="Rechazado">Rechazadas</mat-button-toggle>
          </mat-button-toggle-group>
        </div>
        
        <div class="table-container">
          <table mat-table [dataSource]="filteredRequests" class="mat-elevation-z8">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef> # </th>
              <td mat-cell *matCellDef="let request"> {{request.id}} </td>
            </ng-container>
            
            <!-- Amount Column -->
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef> Monto </th>
              <td mat-cell *matCellDef="let request"> S/. {{request.amount | number:'1.2-2'}} </td>
            </ng-container>
            
            <!-- Term Column -->
            <ng-container matColumnDef="term">
              <th mat-header-cell *matHeaderCellDef> Plazo </th>
              <td mat-cell *matCellDef="let request"> {{request.termInMonths}} meses </td>
            </ng-container>
            
            <!-- Purpose Column -->
            <ng-container matColumnDef="purpose">
              <th mat-header-cell *matHeaderCellDef> Propósito </th>
              <td mat-cell *matCellDef="let request"> {{request.purpose}} </td>
            </ng-container>
            
            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef> Fecha </th>
              <td mat-cell *matCellDef="let request"> {{request.createdAt | date:'dd/MM/yyyy'}} </td>
            </ng-container>
            
            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Estado </th>
              <td mat-cell *matCellDef="let request"> 
                <span class="status-badge" [ngClass]="{
                  'status-pending': request.status === 'Pendiente',
                  'status-approved': request.status === 'Aprobado',
                  'status-rejected': request.status === 'Rechazado'
                }">
                  {{request.status}}
                </span>
              </td>
            </ng-container>
            
            <!-- User Column (opcional, si se quiere mostrar el nombre del usuario) -->
            <ng-container matColumnDef="userName">
              <th mat-header-cell *matHeaderCellDef> Usuario </th>
              <td mat-cell *matCellDef="let request"> {{request.userName}} </td>
            </ng-container>
            
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Acciones </th>
              <td mat-cell *matCellDef="let request">
                <button mat-icon-button color="primary" [routerLink]="['/credit-requests', request.id]" aria-label="Ver solicitud">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" *ngIf="request.status === 'Pendiente'" [routerLink]="['/credit-requests', request.id, 'edit']" aria-label="Editar solicitud">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" *ngIf="request.status === 'Pendiente'" (click)="cancelRequest(request)" aria-label="Cancelar solicitud">
                  <mat-icon>cancel</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner></mat-spinner>
          </div>
          
          <div *ngIf="!isLoading && filteredRequests.length === 0" class="empty-state">
            <mat-icon class="empty-icon">assignment</mat-icon>
            <p>No tienes solicitudes de crédito {{getStatusText()}}</p>
            <button mat-raised-button color="primary" routerLink="/credit-requests/new">Crear Nueva Solicitud</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .credit-list-container {
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
    
    .status-filter {
      margin-bottom: 1.5rem;
    }
    
    .table-container {
      position: relative;
      min-height: 300px;
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
    
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.85rem;
    }
    
    .status-pending {
      background-color: #ffefd5;
      color: #ff9800;
    }
    
    .status-approved {
      background-color: #e0f7ea;
      color: #00b074;
    }
    
    .status-rejected {
      background-color: #fde8e8;
      color: #df4759;
    }
  `
})
export class CreditRequestListComponent implements OnInit {
  private creditRequestService = inject(CreditRequestService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  
  creditRequests: CreditRequest[] = [];
  filteredRequests: CreditRequest[] = [];
  selectedStatus: string = 'all';
  isLoading = true;
  
  displayedColumns: string[] = ['id', 'amount', 'term', 'purpose', 'date', 'status', 'actions'];
  
  ngOnInit(): void {
    this.loadCreditRequests();
  }
  
  loadCreditRequests(): void {
    this.isLoading = true;
    this.creditRequestService.getMyCreditRequests().subscribe({
      next: (requests) => {
        this.creditRequests = requests;
        this.filterByStatus();
        this.isLoading = false;
        if (requests.length === 0) {
          this.notificationService.show('No hay solicitudes realizadas');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.show('Error al cargar las solicitudes');
      }
    });
  }
  
  filterByStatus(): void {
    if (this.selectedStatus === 'all') {
      this.filteredRequests = this.creditRequests;
    } else {
      this.filteredRequests = this.creditRequests.filter(
        request => request.status === this.selectedStatus
      );
    }
  }
  
  getStatusText(): string {
    switch (this.selectedStatus) {
      case 'Pendiente': return 'pendientes';
      case 'Aprobado': return 'aprobadas';
      case 'Rechazado': return 'rechazadas';
      default: return '';
    }
  }
  
  cancelRequest(request: CreditRequest): void {
    if (!request.id) return;
    const confirmCancel = window.confirm('¿Estás seguro de que deseas cancelar esta solicitud?');
    if (!confirmCancel) return;
    this.isLoading = true;
    this.creditRequestService.delete(request.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.show('Solicitud cancelada correctamente');
        this.loadCreditRequests();
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.show('Error al cancelar la solicitud');
      }
    });
  }
} 