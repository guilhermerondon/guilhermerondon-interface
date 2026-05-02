import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MacroRequest {
  peso: number;
  altura: number;
  idade: number;
  objetivo: 'perda' | 'manutencao' | 'ganho';
}

export interface MacroResponse {
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  calorias_totais: number;
  sugestao_suplemento?: string;
}

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MacroService {
  private apiUrl = environment.macroApiUrl;

  constructor(private http: HttpClient) {}

  calculateMacros(data: MacroRequest): Observable<MacroResponse> {
    return this.http.post<MacroResponse>(`${this.apiUrl}/macros`, data);
  }
}
