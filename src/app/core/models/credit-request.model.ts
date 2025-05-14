export interface CreditRequest {
  id?: number;
  userId: number;
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
}

export enum CreditRequestStatus {
  PENDING = 'Pendiente',
  APPROVED = 'Aprobado',
  REJECTED = 'Rechazado'
} 