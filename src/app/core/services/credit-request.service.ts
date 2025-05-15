import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CreditRequest, CreditRequestStatus } from '../models/credit-request.model';

@Injectable({
  providedIn: 'root'
})
export class CreditRequestService {
  private apiUrl = `${environment.apiUrl}/creditrequests`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<CreditRequest[]> {
    return this.http.get<CreditRequest[]>(this.apiUrl);
  }
  
  // Alias for getAll() for better readability in admin components
  getAllCreditRequests(): Observable<CreditRequest[]> {
    return this.getAll();
  }

  getById(id: number): Observable<CreditRequest> {
    return this.http.get<CreditRequest>(`${this.apiUrl}/${id}`);
  }

  getMyCreditRequests(): Observable<CreditRequest[]> {
    return this.http.get<CreditRequest[]>(`${this.apiUrl}/mine`);
  }

  create(creditRequest: CreditRequest): Observable<CreditRequest> {
    const payload = {
      amount: creditRequest.amount,
      termInMonths: creditRequest.termInMonths,
      monthlyIncome: creditRequest.monthlyIncome,
      workSeniority: creditRequest.workSeniority,
      employmentType: creditRequest.employmentType,
      currentDebt: creditRequest.currentDebt,
      purpose: creditRequest.purpose
    };
    return this.http.post<{ message: string, solicitud: CreditRequest }>(this.apiUrl, payload)
      .pipe(
        map(res => res.solicitud)
      );
  }

  update(id: number, creditRequest: Partial<CreditRequest>): Observable<CreditRequest> {
    return this.http.put<{ message: string, solicitud: CreditRequest }>(`${this.apiUrl}/${id}`, creditRequest)
      .pipe(
        map(res => res.solicitud)
      );
  }

  changeStatus(id: number, status: CreditRequestStatus, reason?: string): Observable<CreditRequest> {
    // El backend espera un string como body
    return this.http.put<{ message: string, solicitud: CreditRequest }>(`${this.apiUrl}/${id}/status`, status)
      .pipe(
        map(res => res.solicitud)
      );
  }

  getByStatus(status: CreditRequestStatus): Observable<CreditRequest[]> {
    return this.http.get<CreditRequest[]>(`${this.apiUrl}?status=${status}`);
  }

  // Método para generar un reporte en PDF o Excel
  exportToFile(format: 'pdf' | 'excel'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/${format}`, {
      responseType: 'blob'
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 