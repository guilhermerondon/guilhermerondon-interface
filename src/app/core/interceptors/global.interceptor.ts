import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const globalInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const toastService = inject(ToastService);

  let authReq = req;

  // 1. Injeção do Token JWT
  if (isPlatformBrowser(platformId)) {
    const authToken = localStorage.getItem('token'); 

    // Clona a requisição para injetar o header de Autorização
    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });

      // Adiciona Content-Type apenas para métodos que enviam corpo
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        authReq = authReq.clone({
          setHeaders: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
  }

  // 2. Disparo da requisição e Tratamento Global de Erros
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';

      if (error.error instanceof ErrorEvent) {
        // Erro do lado do cliente ou rede
        errorMsg = `Erro de Conexão: ${error.error.message}`;
      } else {
        // Erro retornado pelo backend (Go, Python, .NET)
        if (error.status === 401) {
          errorMsg = 'Sessão expirada. Por favor, faça login novamente.';
          if (isPlatformBrowser(platformId)) {
            localStorage.removeItem('token');
            router.navigate(['/login']);
          }
        } else if (error.status === 500) {
          errorMsg = 'Erro interno no servidor. O ecossistema está instável no momento.';
        } else {
          errorMsg = `Falha na requisição. Código: ${error.status}`;
        }
      }

      console.error('Interceptor capturou:', errorMsg);
      toastService.showError(errorMsg); 

      // Propaga o erro para que os services específicos também possam lidar com ele se quiserem
      return throwError(() => new Error(errorMsg));
    })
  );
};
