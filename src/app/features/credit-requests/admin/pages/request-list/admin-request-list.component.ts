import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CreditRequest } from '../../../../../core/models/credit-request.model';
import { CreditRequestService } from '../../../../../core/services/credit-request.service';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-admin-request-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule, MatButtonToggleModule, FormsModule],
  template: `
    <div class="admin-list-container">
      <mat-toolbar color="primary">
        <button mat-icon-button routerLink="/admin">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Solicitudes de Crédito</span>
        <span class="toolbar-spacer"></span>
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
            
            <!-- User Column -->
            <ng-container matColumnDef="user">
              <th mat-header-cell *matHeaderCellDef> Solicitante </th>
              <td mat-cell *matCellDef="let request"> {{request.user?.firstName || request.userName || request.username}} {{request.user?.lastName || ''}} </td>
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
            
            <!-- Suggested Approval Column -->
            <ng-container matColumnDef="suggestedApproval">
              <th mat-header-cell *matHeaderCellDef> Aprobación Sugerida </th>
              <td mat-cell *matCellDef="let request">
                <mat-icon color="primary" *ngIf="request.status === 'Aprobado' && request.monthlyIncome >= 1500">check_circle</mat-icon>
                <span *ngIf="!(request.status === 'Aprobado' && request.monthlyIncome >= 1500)">-</span>
              </td>
            </ng-container>
            
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Acciones </th>
              <td mat-cell *matCellDef="let request"> 
                <button mat-icon-button color="primary" [routerLink]="['/admin/requests', request.id]">
                  <mat-icon *ngIf="request.status === 'Pendiente'">assignment_turned_in</mat-icon>
                  <mat-icon *ngIf="request.status !== 'Pendiente'">visibility</mat-icon>
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
            <p>No hay solicitudes de crédito {{getStatusText()}}</p>
          </div>
        </div>
        
        <div class="export-section">
          <button mat-raised-button color="primary" (click)="downloadExcel()">
            <mat-icon>download</mat-icon>
            Descargar Excel
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .admin-list-container {
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
    
    .export-section {
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: flex-end;
    }
  `
})
export class AdminRequestListComponent implements OnInit {
  private creditRequestService = inject(CreditRequestService);
  private route = inject(ActivatedRoute);
  
  creditRequests: CreditRequest[] = [];
  filteredRequests: CreditRequest[] = [];
  selectedStatus: string = 'all';
  isLoading = true;
  
  displayedColumns: string[] = ['id', 'user', 'amount', 'term', 'date', 'status', 'suggestedApproval', 'actions'];
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['status']) {
        this.selectedStatus = params['status'];
      }
      this.loadCreditRequests();
    });
  }
  
  loadCreditRequests(): void {
    this.isLoading = true;
    this.creditRequestService.getAllCreditRequests().subscribe({
      next: (requests: CreditRequest[]) => {
        this.creditRequests = requests;
        this.filterByStatus();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading credit requests:', error);
        this.isLoading = false;
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
  
  downloadExcel(): void {
    this.creditRequestService.exportToFile('excel').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'solicitudes_credito.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Error al descargar el archivo');
      }
    });
  }
} 