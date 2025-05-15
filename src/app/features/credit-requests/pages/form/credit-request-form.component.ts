import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreditRequest } from '../../../../core/models/credit-request.model';
import { CreditRequestService } from '../../../../core/services/credit-request.service';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-credit-request-form',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <mat-toolbar color="primary">
        <button mat-icon-button routerLink="/credit-requests">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>{{ isEditMode ? 'Editar Solicitud de Crédito' : 'Nueva Solicitud de Crédito' }}</span>
        <span class="toolbar-spacer"></span>
      </mat-toolbar>
      
      <div class="content-container">
        <mat-card class="form-card">
          <mat-card-header>
            <mat-card-title>{{ isEditMode ? 'Actualizar Solicitud' : 'Complete los Datos' }}</mat-card-title>
            <mat-card-subtitle>
              Proporcione toda la información solicitada para procesar su solicitud de crédito
            </mat-card-subtitle>
          </mat-card-header>
          
          <form [formGroup]="creditRequestForm" (ngSubmit)="submitForm()">
            <mat-card-content>
              <div class="form-grid">
                <div class="form-column">
                  <h3>Información del Crédito</h3>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Monto Solicitado (S/.)</mat-label>
                    <input 
                      matInput 
                      type="number" 
                      formControlName="amount"
                      min="500"
                      max="50000" 
                      placeholder="Ingrese el monto que necesita">
                    <mat-hint>Mínimo S/. 500, máximo S/. 50,000</mat-hint>
                    <mat-error *ngIf="creditRequestForm.get('amount')?.hasError('required')">
                      El monto es obligatorio
                    </mat-error>
                    <mat-error *ngIf="creditRequestForm.get('amount')?.hasError('min')">
                      El monto mínimo es S/. 500
                    </mat-error>
                    <mat-error *ngIf="creditRequestForm.get('amount')?.hasError('max')">
                      El monto máximo es S/. 50,000
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Plazo (meses)</mat-label>
                    <mat-select formControlName="termInMonths">
                      <mat-option [value]="6">6 meses</mat-option>
                      <mat-option [value]="12">12 meses</mat-option>
                      <mat-option [value]="18">18 meses</mat-option>
                      <mat-option [value]="24">24 meses</mat-option>
                      <mat-option [value]="36">36 meses</mat-option>
                      <mat-option [value]="48">48 meses</mat-option>
                      <mat-option [value]="60">60 meses</mat-option>
                    </mat-select>
                    <mat-error *ngIf="creditRequestForm.get('termInMonths')?.hasError('required')">
                      El plazo es obligatorio
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Propósito del Crédito</mat-label>
                    <mat-select formControlName="purpose">
                      <mat-option value="Personal">Personal</mat-option>
                      <mat-option value="Educación">Educación</mat-option>
                      <mat-option value="Salud">Salud</mat-option>
                      <mat-option value="Viaje">Viaje</mat-option>
                      <mat-option value="Negocio">Negocio</mat-option>
                      <mat-option value="Deudas">Consolidación de Deudas</mat-option>
                      <mat-option value="Otro">Otro</mat-option>
                    </mat-select>
                    <mat-error *ngIf="creditRequestForm.get('purpose')?.hasError('required')">
                      El propósito es obligatorio
                    </mat-error>
                  </mat-form-field>
                </div>
                
                <div class="form-column">
                  <h3>Información Financiera</h3>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Ingreso Mensual (S/.)</mat-label>
                    <input 
                      matInput 
                      type="number" 
                      formControlName="monthlyIncome"
                      min="930" 
                      placeholder="Ingrese su ingreso mensual">
                    <mat-hint>Mínimo sueldo básico (S/. 930)</mat-hint>
                    <mat-error *ngIf="creditRequestForm.get('monthlyIncome')?.hasError('required')">
                      El ingreso mensual es obligatorio
                    </mat-error>
                    <mat-error *ngIf="creditRequestForm.get('monthlyIncome')?.hasError('min')">
                      El ingreso mínimo debe ser al menos S/. 930
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Tipo de Empleo</mat-label>
                    <mat-select formControlName="employmentType">
                      <mat-option value="Dependiente">Dependiente</mat-option>
                      <mat-option value="Independiente">Independiente</mat-option>
                      <mat-option value="Empresa Propia">Empresa Propia</mat-option>
                      <mat-option value="Jubilado">Jubilado</mat-option>
                      <mat-option value="Otro">Otro</mat-option>
                    </mat-select>
                    <mat-error *ngIf="creditRequestForm.get('employmentType')?.hasError('required')">
                      El tipo de empleo es obligatorio
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Antigüedad Laboral (años)</mat-label>
                    <input 
                      matInput 
                      type="number" 
                      formControlName="workSeniority"
                      min="0" 
                      placeholder="Ingrese sus años de antigüedad laboral">
                    <mat-error *ngIf="creditRequestForm.get('workSeniority')?.hasError('required')">
                      La antigüedad laboral es obligatoria
                    </mat-error>
                    <mat-error *ngIf="creditRequestForm.get('workSeniority')?.hasError('min')">
                      La antigüedad no puede ser negativa
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Deuda Actual (S/.)</mat-label>
                    <input 
                      matInput 
                      type="number" 
                      formControlName="currentDebt"
                      min="0" 
                      placeholder="Ingrese su deuda actual">
                    <mat-error *ngIf="creditRequestForm.get('currentDebt')?.hasError('required')">
                      La deuda actual es obligatoria, ingrese 0 si no tiene
                    </mat-error>
                    <mat-error *ngIf="creditRequestForm.get('currentDebt')?.hasError('min')">
                      La deuda no puede ser negativa
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>
            </mat-card-content>
            
            <mat-card-actions class="form-actions">
              <button mat-button type="button" routerLink="/credit-requests">Cancelar</button>
              <button 
                mat-raised-button 
                color="primary" 
                type="submit" 
                [disabled]="creditRequestForm.invalid || isLoading">
                <mat-icon>save</mat-icon>
                {{ isEditMode ? 'Actualizar Solicitud' : 'Enviar Solicitud' }}
              </button>
            </mat-card-actions>
          </form>
        </mat-card>
      </div>
      
      <div *ngIf="isLoading" class="loading-overlay">
        <mat-spinner></mat-spinner>
        <p>{{ isEditMode ? 'Actualizando solicitud...' : 'Enviando solicitud...' }}</p>
      </div>
    </div>
  `,
  styles: `
    .form-container {
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
    
    .form-card {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    
    .form-column h3 {
      margin-bottom: 1.5rem;
      font-weight: 500;
      color: var(--text-primary);
      border-bottom: 1px solid var(--divider-color);
      padding-bottom: 0.5rem;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      padding: 1rem;
      gap: 1rem;
    }
    
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    
    .loading-overlay p {
      margin-top: 1rem;
      font-size: 1.2rem;
      color: var(--text-primary);
    }
    
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class CreditRequestFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private creditRequestService = inject(CreditRequestService);
  
  creditRequestForm: FormGroup;
  isEditMode = false;
  requestId: number | null = null;
  isLoading = false;
  
  constructor() {
    this.creditRequestForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(500), Validators.max(50000)]],
      termInMonths: [null, Validators.required],
      purpose: ['', Validators.required],
      monthlyIncome: [null, [Validators.required, Validators.min(930)]],
      employmentType: ['', Validators.required],
      workSeniority: [null, [Validators.required, Validators.min(0)]],
      currentDebt: [0, [Validators.required, Validators.min(0)]]
    });
  }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.requestId = Number(id);
      this.loadCreditRequest(this.requestId);
    }
  }
  
  loadCreditRequest(id: number): void {
    this.isLoading = true;
    this.creditRequestService.getById(id).subscribe({
      next: (request) => {
        this.creditRequestForm.patchValue({
          amount: request.amount,
          termInMonths: request.termInMonths,
          purpose: request.purpose,
          monthlyIncome: request.monthlyIncome,
          employmentType: request.employmentType,
          workSeniority: request.workSeniority,
          currentDebt: request.currentDebt
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading credit request:', error);
        this.isLoading = false;
        this.router.navigate(['/credit-requests']);
      }
    });
  }
  
  submitForm(): void {
    if (this.creditRequestForm.invalid) return;
    
    this.isLoading = true;
    const formData = this.creditRequestForm.value as Partial<CreditRequest>;
    
    if (this.isEditMode && this.requestId) {
      this.creditRequestService.update(this.requestId, formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/credit-requests']);
        },
        error: (error) => {
          console.error('Error updating credit request:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.creditRequestService.create(formData as CreditRequest).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/credit-requests']);
        },
        error: (error) => {
          console.error('Error creating credit request:', error);
          this.isLoading = false;
        }
      });
    }
  }
} 