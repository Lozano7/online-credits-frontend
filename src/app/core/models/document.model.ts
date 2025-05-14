export interface Document {
  id?: number;
  creditRequestId: number;
  documentType: string;
  filePath: string;
  uploadDate: Date;
  status: DocumentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum DocumentStatus {
  PENDING = 'Pendiente',
  APPROVED = 'Aprobado',
  REJECTED = 'Rechazado'
} 