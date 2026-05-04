import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="glass-panel">
        <h2>Acesso Restrito</h2>
        <p>Insira suas credenciais para gerenciar suas finanças.</p>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required placeholder="seu@email.com">
          </div>

          <div class="form-group">
            <label for="senha">Senha</label>
            <input type="password" id="senha" [(ngModel)]="senha" name="senha" required placeholder="Sua senha">
          </div>

          <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>

          <button type="submit" [disabled]="isLoading">
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>

          <div class="divider">ou</div>

          <button type="button" class="btn-demo" (click)="loginAsGuest()" [disabled]="isLoading">
            Acesso Demonstrativo
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 3rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
      text-align: center;
    }

    h2 {
      margin-top: 0;
      color: #fff;
      font-weight: 600;
    }

    p {
      color: #aaa;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }

    .form-group {
      text-align: left;
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #ccc;
      font-size: 0.85rem;
    }

    input {
      width: 100%;
      padding: 0.8rem 1rem;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.3s;
    }

    input:focus {
      border-color: #646cff;
    }

    button {
      width: 100%;
      padding: 1rem;
      background: #646cff;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s, transform 0.1s;
      margin-top: 1rem;
    }

    button:hover:not(:disabled) {
      background: #535bf2;
    }

    button:active:not(:disabled) {
      transform: scale(0.98);
    }

    button:disabled {
      background: #444;
      cursor: not-allowed;
    }

    .error-msg {
      color: #ff6b6b;
      font-size: 0.85rem;
      margin-top: -0.5rem;
      margin-bottom: 1rem;
      text-align: left;
    }

    .divider {
      margin: 1.5rem 0;
      color: #aaa;
      font-size: 0.9rem;
      position: relative;
    }
    .divider::before, .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }
    .divider::before { left: 0; }
    .divider::after { right: 0; }

    .btn-demo {
      background: transparent;
      border: 1px solid #646cff;
      color: #646cff;
      margin-top: 0;
    }
    .btn-demo:hover:not(:disabled) {
      background: rgba(100, 108, 255, 0.1);
    }
  `]
})
export class LoginComponent {
  email = '';
  senha = '';
  errorMessage = '';
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    if (!this.email || !this.senha) {
      this.errorMessage = 'Preencha todos os campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        this.router.navigate(['/finance']); // Redireciona pro dashboard
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Credenciais inválidas. Tente novamente.';
        console.error(err);
      }
    });
  }

loginAsGuest() {
  this.isLoading = true;
  this.errorMessage = '';

  // AJUSTE: Chama o método específico de demonstração que criamos no AuthService
  this.authService.loginDemonstrativo().subscribe({
    next: () => {
      this.router.navigate(['/finance']);
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = 'O acesso demonstrativo está temporariamente indisponível.';
      console.error(err);
    }
  });
}
}
