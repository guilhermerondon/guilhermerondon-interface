import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
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

  public isLoggedIn = signal<boolean>(true);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Forçamos um token fake no localStorage se não houver
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', 'fake-jwt-token-for-stabilization');
      }
      this.isLoggedIn.set(true);
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

  // AJUSTE: Novo método para o botão de Acesso Demonstrativo
  loginDemonstrativo() {

    console.log('🚀 Enviando POST para:', `${this.apiUrl}/demo`);

    return this.http.post<{token: string}>(`${this.apiUrl}/demo`, {}).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          this.isLoggedIn.set(true);
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
