import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreditRequest, CreditRequestStatus } from '../../../../../core/models/credit-request.model';
import { Document } from '../../../../../core/models/document.model';
import { CreditRequestService } from '../../../../../core/services/credit-request.service';
import { MaterialModule } from '../../../../../shared/material.module';
import { NotificationService } from '../../../../../shared/services/notification.service';

@Component({
  selector: 'app-admin-request-detail',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="detail-container">
      <mat-toolbar color="primary">
        <button mat-icon-button routerLink="/admin/requests">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Solicitud de Crédito #{{creditRequest?.id}}</span>
        <span class="toolbar-spacer"></span>
      </mat-toolbar>
      
      <div class="content-container" *ngIf="creditRequest">
        <mat-card class="request-card">
          <mat-card-header>
            <div mat-card-avatar>
              <mat-icon>person</mat-icon>
            </div>
            <mat-card-title>
              {{creditRequest.user?.firstName}} {{creditRequest.user?.lastName}}
            </mat-card-title>
            <mat-card-subtitle>
              <span class="status-badge" [ngClass]="{
                'status-pending': creditRequest.status === CreditRequestStatus.PENDING,
                'status-approved': creditRequest.status === CreditRequestStatus.APPROVED,
                'status-rejected': creditRequest.status === CreditRequestStatus.REJECTED
              }">
                {{creditRequest.status}}
              </span>
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="request-details">
              <div class="detail-section">
                <h3>Información del Solicitante</h3>
                <div class="detail-item">
                  <span class="label">Nombre de usuario:</span>
                  <span>{{creditRequest.userName || creditRequest.user?.username}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Correo:</span>
                  <span>{{creditRequest.userEmail || creditRequest.user?.email}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Ingreso mensual:</span>
                  <span>S/. {{creditRequest.monthlyIncome | number:'1.2-2'}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Antigüedad laboral:</span>
                  <span>{{creditRequest.workSeniority}} años</span>
                </div>
                <div class="detail-item">
                  <span class="label">Tipo de empleo:</span>
                  <span>{{creditRequest.employmentType}}</span>
                </div>
              </div>
              
              <div class="detail-section">
                <h3>Detalles del Crédito</h3>
                <div class="detail-item">
                  <span class="label">Monto:</span>
                  <span>S/. {{creditRequest.amount | number:'1.2-2'}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Plazo:</span>
                  <span>{{creditRequest.termInMonths}} meses</span>
                </div>
                <div class="detail-item">
                  <span class="label">Propósito:</span>
                  <span>{{creditRequest.purpose}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Fecha de solicitud:</span>
                  <span>{{creditRequest.createdAt | date:'dd/MM/yyyy HH:mm'}}</span>
                </div>
              </div>
              
              <div class="detail-section" *ngIf="creditRequest.status === CreditRequestStatus.REJECTED">
                <h3>Motivo de Rechazo</h3>
                <p>{{creditRequest.rejectionReason}}</p>
              </div>
              
              <div class="detail-section" *ngIf="creditRequest.status === CreditRequestStatus.APPROVED && creditRequest.monthlyIncome >= 1500">
                <div class="auto-eval-message">
                  <mat-icon color="primary">auto_awesome</mat-icon>
                  <span>Esta solicitud fue <b>aprobada automáticamente</b> porque el ingreso mensual es mayor a S/. 1,500.</span>
                </div>
              </div>
            </div>
            
            <div class="documents-section" *ngIf="creditRequest.documents && creditRequest.documents.length > 0">
              <h3>Documentos</h3>
              <mat-list>
                <mat-list-item *ngFor="let doc of creditRequest.documents">
                  <mat-icon matListItemIcon>description</mat-icon>
                  <div matListItemTitle>{{doc.title}}</div>
                  <div matListItemLine>{{doc.fileType}} - {{doc.fileSize | number}} KB</div>
                  <button mat-icon-button color="primary" (click)="viewDocument(doc)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </mat-list-item>
              </mat-list>
            </div>
          </mat-card-content>
          
          <mat-card-actions *ngIf="creditRequest.status === CreditRequestStatus.PENDING">
            <form [formGroup]="evaluationForm" (ngSubmit)="submitEvaluation()">
              <div class="evaluation-section">
                <h3>Evaluación</h3>
                <mat-button-toggle-group formControlName="decision">
                  <mat-button-toggle value="approve" class="approve-toggle">Aprobar</mat-button-toggle>
                  <mat-button-toggle value="reject" class="reject-toggle">Rechazar</mat-button-toggle>
                </mat-button-toggle-group>
                
                <mat-form-field *ngIf="showRejectionReasonField()" class="full-width">
                  <mat-label>Motivo del rechazo</mat-label>
                  <textarea matInput formControlName="rejectionReason" rows="3" placeholder="Indique el motivo del rechazo"></textarea>
                </mat-form-field>
                
                <div class="action-buttons">
                  <button mat-button type="button" routerLink="/admin/requests">Cancelar</button>
                  <button mat-raised-button color="primary" type="submit" [disabled]="isLoading || !canSubmit()">
                    <mat-icon>save</mat-icon>
                    Guardar Decisión
                  </button>
                </div>
              </div>
            </form>
          </mat-card-actions>
        </mat-card>
      </div>
      
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>
    </div>
  `,
  styles: `
    .detail-container {
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
      overflow-y: auto;
    }
    
    .request-card {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .request-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .detail-section {
      margin-bottom: 1.5rem;
    }
    
    .detail-section h3 {
      margin-bottom: 1rem;
      font-weight: 500;
      color: var(--text-primary);
      border-bottom: 1px solid var(--divider-color);
      padding-bottom: 0.5rem;
    }
    
    .detail-item {
      margin-bottom: 0.5rem;
      display: flex;
    }
    
    .detail-item .label {
      font-weight: 500;
      min-width: 120px;
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
    
    .documents-section {
      margin-top: 2rem;
    }
    
    .documents-section h3 {
      margin-bottom: 1rem;
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .evaluation-section {
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 4px;
      margin-top: 1rem;
    }
    
    .evaluation-section h3 {
      margin-bottom: 1rem;
      font-weight: 500;
    }
    
    .full-width {
      width: 100%;
      margin-top: 1rem;
    }
    
    .action-buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
      gap: 1rem;
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
    
    .approve-toggle {
      color: #fff !important;
      background-color: #43a047 !important;
    }
    .approve-toggle.mat-button-toggle-checked {
      background-color: #388e3c !important;
      color: #fff !important;
    }
    .reject-toggle {
      color: #fff !important;
      background-color: #e53935 !important;
    }
    .reject-toggle.mat-button-toggle-checked {
      background-color: #b71c1c !important;
      color: #fff !important;
    }
    
    .auto-eval-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #e8f5e9;
      color: #388e3c;
      border: 1px solid #a5d6a7;
      border-radius: 6px;
      padding: 0.75rem 1rem;
      margin-bottom: 1.5rem;
      font-weight: 500;
      font-size: 1.05rem;
    }
  `
})
export class AdminRequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private creditRequestService = inject(CreditRequestService);
  private formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  
  protected CreditRequestStatus = CreditRequestStatus;
  
  creditRequest: CreditRequest | null = null;
  isLoading = false;
  
  evaluationForm: FormGroup = this.formBuilder.group({
    decision: ['', Validators.required],
    rejectionReason: ['']
  });
  
  ngOnInit(): void {
    this.loadCreditRequest();
  }
  
  loadCreditRequest(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    
    this.isLoading = true;
    this.creditRequestService.getById(Number(id)).subscribe({
      next: (request) => {
        this.creditRequest = request;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading credit request:', error);
        this.isLoading = false;
        this.router.navigate(['/admin/requests']);
      }
    });
  }
  
  showRejectionReasonField(): boolean {
    return this.evaluationForm.get('decision')?.value === 'reject';
  }
  
  canSubmit(): boolean {
    if (this.evaluationForm.get('decision')?.value === 'reject') {
      return this.evaluationForm.valid;
    }
    return this.evaluationForm.get('decision')?.valid || false;
  }
  
  submitEvaluation(): void {
    if (this.evaluationForm.invalid || !this.creditRequest?.id) return;
    const decision = this.evaluationForm.get('decision')?.value;
    const rejectionReason = this.evaluationForm.get('rejectionReason')?.value;
    const newStatus: CreditRequestStatus = 
      decision === 'approve' ? CreditRequestStatus.APPROVED : CreditRequestStatus.REJECTED;
    this.isLoading = true;
    this.creditRequestService.changeStatus(
      this.creditRequest.id, 
      newStatus, 
      decision === 'reject' ? rejectionReason : undefined
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.show('Estado actualizado correctamente');
        this.router.navigate(['/admin/requests']);
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.show(error?.error?.message || 'Error al actualizar el estado');
      }
    });
  }
  
  viewDocument(document: Document): void {
    // Aquí se implementaría la lógica para ver el documento
    console.log('View document', document);
  }
} 