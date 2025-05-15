import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreditRequest, CreditRequestStatus } from '../../../../core/models/credit-request.model';
import { Document } from '../../../../core/models/document.model';
import { CreditRequestService } from '../../../../core/services/credit-request.service';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-credit-request-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule],
  template: `
    <div class="detail-container">
      <mat-toolbar color="primary">
        <button mat-icon-button routerLink="/credit-requests">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Solicitud de Crédito #{{creditRequest?.id}}</span>
        <span class="toolbar-spacer"></span>
        <button 
          mat-icon-button 
          *ngIf="creditRequest?.status === CreditRequestStatus.PENDING"
          [routerLink]="['/credit-requests', creditRequest?.id, 'edit']">
          <mat-icon>edit</mat-icon>
        </button>
      </mat-toolbar>
      
      <div class="content-container" *ngIf="creditRequest">
        <mat-card class="detail-card">
          <mat-card-header>
            <mat-card-title>
              <span class="status-badge" [ngClass]="{
                'status-pending': creditRequest.status === CreditRequestStatus.PENDING,
                'status-approved': creditRequest.status === CreditRequestStatus.APPROVED,
                'status-rejected': creditRequest.status === CreditRequestStatus.REJECTED
              }">
                {{creditRequest.status}}
              </span>
            </mat-card-title>
            <mat-card-subtitle>
              Solicitud creada el {{creditRequest.createdAt | date:'dd/MM/yyyy'}}
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="detail-section">
              <h3>Información del Crédito</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Monto Solicitado:</span>
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
                  <span class="label">Fecha de Solicitud:</span>
                  <span>{{creditRequest.createdAt | date:'dd/MM/yyyy HH:mm'}}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h3>Información Financiera</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Ingreso Mensual:</span>
                  <span>S/. {{creditRequest.monthlyIncome | number:'1.2-2'}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Tipo de Empleo:</span>
                  <span>{{creditRequest.employmentType}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Antigüedad Laboral:</span>
                  <span>{{creditRequest.workSeniority}} años</span>
                </div>
                <div class="detail-item">
                  <span class="label">Deuda Actual:</span>
                  <span>S/. {{creditRequest.currentDebt | number:'1.2-2'}}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section" *ngIf="creditRequest.status === CreditRequestStatus.APPROVED">
              <h3>Detalles de Aprobación</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Monto Aprobado:</span>
                  <span>S/. {{creditRequest.approvedAmount | number:'1.2-2'}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Tasa de Interés:</span>
                  <span>{{creditRequest.interestRate}}%</span>
                </div>
                <div class="detail-item">
                  <span class="label">Cuota Mensual:</span>
                  <span>S/. {{creditRequest.monthlyPayment | number:'1.2-2'}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Fecha de Aprobación:</span>
                  <span>{{creditRequest.evaluationDate | date:'dd/MM/yyyy'}}</span>
                </div>
              </div>
              
              <div class="cta-section">
                <h4>¡Su crédito ha sido aprobado!</h4>
                <p>
                  Un asesor se pondrá en contacto con usted en las próximas 24 horas para coordinar 
                  la firma de documentos y el desembolso del dinero.
                </p>
                <button mat-raised-button color="primary" (click)="downloadApprovalDocument()">
                  <mat-icon>download</mat-icon>
                  Descargar Carta de Aprobación
                </button>
              </div>
            </div>
            
            <div class="detail-section" *ngIf="creditRequest.status === CreditRequestStatus.REJECTED">
              <h3>Detalles de Rechazo</h3>
              <div class="rejection-reason">
                <p><strong>Motivo de rechazo:</strong></p>
                <p>{{creditRequest.rejectionReason}}</p>
              </div>
              
              <div class="cta-section">
                <p>
                  Si tiene alguna duda sobre el rechazo de su solicitud, puede contactar con nuestro
                  servicio de atención al cliente o intentar con una nueva solicitud.
                </p>
                <button mat-raised-button color="primary" routerLink="/credit-requests/new">
                  <mat-icon>add</mat-icon>
                  Nueva Solicitud
                </button>
              </div>
            </div>
            
            <div class="detail-section" *ngIf="creditRequest.documents && creditRequest.documents.length > 0">
              <h3>Documentos Adjuntos</h3>
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
              
              <div *ngIf="creditRequest.status === CreditRequestStatus.PENDING" class="upload-section">
                <button mat-raised-button color="accent" (click)="uploadDocument()">
                  <mat-icon>upload</mat-icon>
                  Adjuntar Documento
                </button>
                <mat-hint>
                  Los documentos adjuntos aceleran el proceso de revisión de su solicitud.
                </mat-hint>
              </div>
            </div>
          </mat-card-content>
          
          <mat-card-actions *ngIf="creditRequest.status === CreditRequestStatus.PENDING">
            <div class="action-buttons">
              <button mat-button routerLink="/credit-requests">
                Volver a la Lista
              </button>
              <button 
                mat-raised-button 
                color="warn" 
                (click)="cancelRequest()"
                [disabled]="isLoading">
                <mat-icon>cancel</mat-icon>
                Cancelar Solicitud
              </button>
            </div>
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
    
    .detail-card {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.85rem;
      text-transform: uppercase;
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
    
    .detail-section {
      margin-bottom: 2rem;
    }
    
    .detail-section h3 {
      margin-bottom: 1rem;
      font-weight: 500;
      color: var(--text-primary);
      border-bottom: 1px solid var(--divider-color);
      padding-bottom: 0.5rem;
    }
    
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .detail-item {
      margin-bottom: 0.5rem;
    }
    
    .detail-item .label {
      font-weight: 500;
      color: var(--text-secondary);
      display: block;
      margin-bottom: 0.25rem;
    }
    
    .rejection-reason {
      padding: 1rem;
      background-color: #fde8e8;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }
    
    .rejection-reason p:first-child {
      margin-top: 0;
    }
    
    .rejection-reason p:last-child {
      margin-bottom: 0;
    }
    
    .cta-section {
      background-color: #f5f5f5;
      padding: 1.5rem;
      border-radius: 4px;
      text-align: center;
      margin-top: 1.5rem;
    }
    
    .cta-section h4 {
      margin-top: 0;
      color: #00b074;
    }
    
    .upload-section {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    
    .upload-section button {
      margin-bottom: 0.5rem;
    }
    
    .action-buttons {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 0 1rem;
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
    
    @media (max-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class CreditRequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private creditRequestService = inject(CreditRequestService);
  private dialog = inject(MatDialog);
  
  // Enum para uso en el template
  protected CreditRequestStatus = CreditRequestStatus;
  
  creditRequest: CreditRequest | null = null;
  isLoading = false;
  
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
        this.router.navigate(['/credit-requests']);
      }
    });
  }
  
  cancelRequest(): void {
    if (!this.creditRequest?.id) return;
    
    // Aquí se implementaría un diálogo de confirmación
    const confirmation = window.confirm('¿Está seguro que desea cancelar esta solicitud?');
    if (!confirmation) return;
    
    this.isLoading = true;
    this.creditRequestService.update(this.creditRequest.id, { 
      status: CreditRequestStatus.REJECTED,
      rejectionReason: 'Cancelado por el usuario'
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/credit-requests']);
      },
      error: (error) => {
        console.error('Error cancelling credit request:', error);
        this.isLoading = false;
      }
    });
  }
  
  downloadApprovalDocument(): void {
    // Aquí se implementaría la lógica para descargar el documento
    console.log('Downloading approval document...');
  }
  
  viewDocument(document: Document): void {
    // Aquí se implementaría la lógica para ver el documento
    console.log('View document', document);
  }
  
  uploadDocument(): void {
    // Aquí se implementaría un diálogo para subir documentos
    console.log('Upload document dialog...');
  }
} 