export interface Document {
  id?: number;
  creditRequestId: number;
  documentType: string;
  filePath: string;
  uploadDate: Date;
  status: DocumentStatus;
  title: string;
  fileType: string;
  fileSize: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum DocumentStatus {
  PENDING = 'Pendiente',
  APPROVED = 'Aprobado',
  REJECTED = 'Rechazado'
} 