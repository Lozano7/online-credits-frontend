export interface CreditEvaluation {
  id?: number;
  creditRequestId: number;
  evaluatedBy?: number;
  evaluationDate: Date;
  score?: number;
  automaticEvaluation: string;
  manualEvaluation: string;
  comments: string;
  createdAt?: Date;
  updatedAt?: Date;
} 