export interface AuditLog {
  id?: number;
  action: string;
  entityType: string;
  entityId: number;
  details: string;
  userId: string;
  userName: string;
  timestamp: Date;
} 