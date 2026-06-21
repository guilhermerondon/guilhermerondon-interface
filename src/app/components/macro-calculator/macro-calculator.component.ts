import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MacroService, MacroRequest, MacroResponse } from '../../services/macro.service';
import { LanguageService } from '../../services/language.service';

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
  public langService = inject(LanguageService);

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
        this.error.set('Erro na conexão com a API de Macros. Verifique a disponibilidade do serviço.');
        this.isLoading.set(false);
      }
    });
  }

  isDownloading = signal<boolean>(false);

  onDownloadReport(): void {
    if (!this.result()) return;

    this.isDownloading.set(true);
    
    const athleteData = {
      calories: this.result()?.calorias_totais,
      protein: this.result()?.proteinas,
      carbs: this.result()?.carboidratos,
      fat: this.result()?.gorduras
    };
    
    this.macroService.downloadMacroReport(athleteData).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rondon_athlete_report_${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isDownloading.set(false);
      },
      error: (err) => {
        console.error('Erro ao baixar relatório:', err);
        this.isDownloading.set(false);
      }
    });
  }
}
