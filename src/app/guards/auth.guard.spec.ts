import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { PLATFORM_ID } from '@angular/core';

describe('authGuard', () => {
  let authService: any;
  let router: any;

  beforeEach(() => {
    const authSpy = { getToken: vi.fn() };
    const routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    authService = TestBed.inject(AuthService) as any;
    router = TestBed.inject(Router) as any;
  });

  it('deve permitir acesso se houver token', () => {
    authService.getToken.mockReturnValue('valid-token');
    
    // Como é uma CanActivateFn, chamamos diretamente no contexto do TestBed
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    
    expect(result).toBe(true);
  });

  it('deve bloquear acesso e redirecionar se não houver token', () => {
    authService.getToken.mockReturnValue(null);
    
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
