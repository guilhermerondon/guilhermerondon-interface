import { Component, OnInit, OnDestroy, signal, inject, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfraService, Monitor, UptimeLog } from '../../services/infra.service';
import { forkJoin, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface MonitorView extends Monitor {
  history: UptimeLog[];
  latency: number;
}

@Component({
  selector: 'app-infra-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="status-container">
      <div class="header">
        <h2 class="neon-text">Uptime Monitor</h2>
        <p>Monitoramento de Infraestrutura em Tempo Real</p>
      </div>

      <div class="monitors-grid">
        @for (monitor of monitors(); track monitor.id) {
          <div class="glass-card">
            <div class="card-header">
              <div class="monitor-info">
                <h3>{{ monitor.name }}</h3>
                <span class="url">{{ monitor.url }}</span>
              </div>
              <div class="status-indicator">
                <div class="led" [ngClass]="monitor.current_status === 'Online' ? 'led-online' : 'led-offline'"></div>
                <span class="status-text" [ngClass]="monitor.current_status === 'Online' ? 'text-online' : 'text-offline'">
                  {{ monitor.current_status }}
                </span>
              </div>
            </div>

            <div class="metrics">
              <div class="metric-item">
                <span class="metric-label">Latência Atual</span>
                <span class="metric-value font-mono">{{ monitor.latency }}ms</span>
              </div>
            </div>

            <div class="history-section">
              <span class="history-label font-mono">Últimas Checagens (24)</span>
              <div class="blocks-container">
                @for (log of monitor.history; track log.id) {
                  <div class="history-block" 
                       [ngClass]="log.status_code > 0 && log.status_code < 500 ? 'block-success' : 'block-error'"
                       [title]="'Status: ' + log.status_code + ' | Latência: ' + log.latency_ms + 'ms | ' + (log.timestamp | date:'HH:mm:ss')">
                  </div>
                }
              </div>
            </div>
          </div>
        } @empty {
          <div *ngIf="!isLoading()" class="empty-state" style="grid-column: 1 / -1; text-align: center; color: #aaa;">
            <p>Nenhum monitor configurado no momento.</p>
          </div>
        }
      </div>
      
      <div *ngIf="isLoading()" class="loading-state">
        <div class="spinner"></div>
        <p>Conectando ao motor de monitoramento (Go)...</p>
      </div>
    </div>
  `,
  styles: [`
    .font-mono {
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
    }
  
    .status-container {
      padding: 2rem;
      min-height: 80vh;
      animation: fadeIn 0.5s ease-out;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .neon-text {
      font-size: 2.5rem;
      margin: 0;
      background: linear-gradient(90deg, var(--project-accent, #06b6d4), #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px var(--project-glow, rgba(6, 182, 212, 0.3));
    }

    .header p {
      color: #aaa;
      font-size: 1.1rem;
      margin-top: 0.5rem;
    }

    .monitors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .glass-card {
      background: var(--project-bg-dim, rgba(20, 20, 30, 0.6));
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 8px 32px var(--project-glow, rgba(0, 0, 0, 0.3));
      transition: transform 0.3s;
      position: relative;
      border: 1px solid transparent;
      background-clip: padding-box;
    }

    .glass-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      border-radius: 16px;
      padding: 1px;
      background: linear-gradient(135deg, var(--project-accent, #14b8a6), transparent);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .glass-card:hover {
      transform: translateY(-5px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 1rem;
    }

    .monitor-info h3 {
      margin: 0 0 0.2rem 0;
      color: #fff;
      font-size: 1.2rem;
    }

    .url {
      color: #888;
      font-size: 0.8rem;
      word-break: break-all;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(0, 0, 0, 0.3);
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
    }

    .led {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .led-online {
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulse-green 2s infinite;
    }

    .led-offline {
      background: #ef4444;
      box-shadow: 0 0 10px #ef4444;
      animation: pulse-red 2s infinite;
    }

    .status-text {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .text-online { color: #10b981; }
    .text-offline { color: #ef4444; }

    .metrics {
      margin-bottom: 1.5rem;
    }

    .metric-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(0, 0, 0, 0.2);
      padding: 0.8rem;
      border-radius: 8px;
    }

    .metric-label {
      color: #aaa;
      font-size: 0.9rem;
    }

    .metric-value {
      color: #fff;
      font-weight: bold;
      font-size: 1.1rem;
    }

    .history-section {
      margin-top: 1rem;
    }

    .history-label {
      display: block;
      color: #888;
      font-size: 0.8rem;
      margin-bottom: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .blocks-container {
      display: flex;
      gap: 4px;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .history-block {
      width: 8px;
      height: 24px;
      border-radius: 4px;
      opacity: 0.8;
      transition: opacity 0.2s, transform 0.2s;
      cursor: pointer;
    }

    .history-block:hover {
      opacity: 1;
      transform: scale(1.2);
    }

    .block-success { background: #10b981; }
    .block-error { background: #ef4444; }

    .loading-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem;
      color: #aaa;
    }

    .spinner {
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top: 3px solid var(--project-accent, #a78bfa);
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem auto;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pulse-green {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    @keyframes pulse-red {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    @media (max-width: 768px) {
      .monitors-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class InfraStatusComponent implements OnInit, OnDestroy {
  @HostBinding('class') hostClass = 'theme-status';
  
  monitors = signal<MonitorView[]>([]);
  isLoading = signal<boolean>(true);
  
  private infraService = inject(InfraService);
  private subscription?: Subscription;

  ngOnInit() {
    // Polling nativo usando RxJS a cada 10 segundos
    this.subscription = timer(0, 10000).pipe(
      switchMap(() => this.infraService.getMonitors())
    ).subscribe({
      next: (monitorsList) => {
        // Para cada monitor, disparar o fetch do seu histórico em paralelo
        const requests = monitorsList.map(m => this.infraService.getMonitorHistory(m.id));
        
        if (requests.length > 0) {
          forkJoin(requests).subscribe(histories => {
            const views: MonitorView[] = monitorsList.map((m, index) => {
              const history = histories[index];
              // O histórico vem ordenado do banco (mais recente primeiro)
              // Revertemos para os blocos ficarem da esquerda (antigo) para direita (novo)
              const displayHistory = [...history].reverse(); 
              return {
                ...m,
                history: displayHistory,
                latency: history.length > 0 ? history[0].latency_ms : 0
              };
            });
            this.monitors.set(views);
            this.isLoading.set(false);
          });
        } else {
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Erro ao buscar status da infraestrutura', err);
        this.isLoading.set(false);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
