import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // AJUSTE: Construção segura da URL para evitar bater na raiz (404)
  private baseUrl = environment.financeApiUrl.endsWith('/')
    ? environment.financeApiUrl.slice(0, -1)
    : environment.financeApiUrl;

  private apiUrl = `${this.baseUrl}/api/Auth`;

  public isLoggedIn = signal<boolean>(false);

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn.set(true);
      }
    }
  }

  // Login Padrão
  login(email: string, senha: string) {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, { email, senha }).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  // AJUSTE: Novo método para o botão de Acesso Demonstrativo (Gera Sandbox Isolada)
  loginDemonstrativo() {
    return this.http.post<{token: string}>(`${this.apiUrl}/anonymous`, {}).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          this.isLoggedIn.set(true); // Atualização imediata
        }
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.isLoggedIn.set(false);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
}
