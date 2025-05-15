import { Document } from './document.model';
import { User } from './user.model';

export interface CreditRequest {
  id?: number;
  userId: number;
  user?: User;
  amount: number;
  termInMonths: number;
  monthlyIncome: number;
  workSeniority: number;
  employmentType: string;
  currentDebt: number;
  purpose: string;
  status: CreditRequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
  evaluatedBy?: number;
  evaluationDate?: Date;
  rejectionReason?: string;
  approvedAmount?: number;
  interestRate?: number;
  monthlyPayment?: number;
  documents?: Document[];
}

export enum CreditRequestStatus {
  PENDING = 'Pendiente',
  APPROVED = 'Aprobado',
  REJECTED = 'Rechazado'
} 