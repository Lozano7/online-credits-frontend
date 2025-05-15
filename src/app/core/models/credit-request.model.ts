
export interface CreditRequest {
  id?: number;
  amount: number;
  termInMonths: number;
  monthlyIncome: number;
  workSeniority: number;
  employmentType: string;
  currentDebt: number;
  purpose: string;
  status: CreditRequestStatus | string;
  createdAt?: Date | string;
  updatedAt?: Date | string | null;
  evaluatedBy?: number;
  evaluationDate?: Date;
  rejectionReason?: string | null;
  approvedAmount?: number | null;
  interestRate?: number | null;
  monthlyPayment?: number | null;
  userId?: number;
  userName?: string;
  userEmail?: string;
  user?: any;
  documents?: any[];
}

export enum CreditRequestStatus {
  PENDING = 'Pendiente',
  APPROVED = 'Aprobado',
  REJECTED = 'Rechazado'
} 