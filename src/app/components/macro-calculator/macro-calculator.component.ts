import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MacroService, MacroRequest, MacroResponse } from '../../services/macro.service';

@Component({
  selector: 'app-macro-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './macro-calculator.component.html',
  styleUrl: './macro-calculator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacroCalculatorComponent {
  private macroService = inject(MacroService);

  // Estado do Formulário usando Signals do Angular 17
  request = signal<MacroRequest>({
    peso: 70,
    altura: 170,
    idade: 25,
    objetivo: 'manutencao'
  });

  // Estado da Resposta e Loading
  result = signal<MacroResponse | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  calculate() {
    this.isLoading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.macroService.calculateMacros(this.request()).subscribe({
      next: (res) => {
        this.result.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao calcular macros', err);
        this.error.set('Erro na conexão com a API. Verifique se o servidor está rodando na porta 8000.');
        this.isLoading.set(false);
      }
    });
  }
}
