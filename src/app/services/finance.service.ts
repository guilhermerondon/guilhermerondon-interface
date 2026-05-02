import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: string;
}

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiUrl = environment.financeApiUrl;
  private http = inject(HttpClient);

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  createTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    const payload = {
      descricao: transaction.description,
      valor: Number(transaction.amount),
      data: new Date(transaction.date).toISOString(),
      tipo: transaction.type
    };
    return this.http.post<Transaction>(this.apiUrl, payload);
  }

  updateTransaction(id: number, transaction: Omit<Transaction, 'id'>): Observable<void> {
    const payload = {
      descricao: transaction.description,
      valor: Number(transaction.amount),
      data: new Date(transaction.date).toISOString(),
      tipo: transaction.type
    };
    return this.http.put<void>(`${this.apiUrl}/${id}`, payload);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
