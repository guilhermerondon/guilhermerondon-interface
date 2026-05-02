import { Component, OnInit, signal, inject, computed, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService, Transaction } from '../../services/finance.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="dashboard-container">
      <div class="glass-panel">
        <div class="header">
          <div class="header-titles">
            <h2>Finance Ledger</h2>
            <p>Visão geral das suas transações</p>
          </div>
          <button class="btn-add" (click)="toggleModal()">+ Nova Transação</button>
        </div>

        <div *ngIf="isLoading()" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando transações...</p>
        </div>

        <div *ngIf="!isLoading() && transactions().length === 0" class="empty-state">
          <p>Nenhuma transação encontrada. O banco de dados foi recém-criado!</p>
        </div>

        <div class="chart-container" *ngIf="!isLoading() && transactions().length > 0">
          <canvas baseChart
            [data]="chartData()"
            [options]="chartOptions"
            [type]="'doughnut'">
          </canvas>
        </div>

        <div class="table-responsive" *ngIf="!isLoading() && transactions().length > 0">
          <table class="glass-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th class="text-right">Valor</th>
                <th class="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (t of transactions(); track t.id) {
                <tr>
                  <td class="font-mono">{{ t.date | date:'dd/MM/yyyy' }}</td>
                  <td>{{ t.description }}</td>
                  <td>
                    <span class="badge" [ngClass]="isIncome(t.type) ? 'badge-income' : 'badge-expense'">
                      {{ t.type === 'Income' ? 'Entrada' : 'Saída' }}
                    </span>
                  </td>
                  <td class="text-right font-mono" [ngClass]="isIncome(t.type) ? 'text-income' : 'text-expense'">
                    {{ t.amount | currency:'BRL':'symbol':'1.2-2' }}
                  </td>
                  <td class="text-right actions-cell">
                    <button class="btn-icon btn-edit" (click)="prepareEdit(t)" title="Editar">✏️</button>
                    <button class="btn-icon btn-delete" (click)="confirmDelete(t.id)" title="Excluir">🗑️</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="text-center" style="padding: 2rem; color: #aaa;">
                    Nenhuma transação cadastrada.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Overlay Escuro -->
    <div class="drawer-overlay" *ngIf="showModal()" (click)="toggleModal()" @fadeInOut></div>

    <!-- Side Drawer (Barra Lateral) -->
    <div class="side-drawer" *ngIf="showModal()" @slideInOut>
      <div class="drawer-header">
        <h3>{{ editTxId() ? 'Editar Transação' : 'Nova Transação' }}</h3>
        <button class="btn-close" (click)="toggleModal()">×</button>
      </div>

      <form (ngSubmit)="saveTransaction()">
        <div class="form-group">
          <label>Descrição</label>
          <input type="text" [(ngModel)]="newTx.description" name="desc" required placeholder="Ex: Supermercado">
        </div>
        <div class="form-group">
          <label>Valor (R$)</label>
          <input type="number" [(ngModel)]="newTx.amount" name="amount" required step="0.01" min="0.01">
        </div>
        <div class="form-group">
          <label>Data</label>
          <input type="date" [(ngModel)]="newTx.date" name="date" required>
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <select [(ngModel)]="newTx.type" name="type" required>
            <option value="Income">Entrada</option>
            <option value="Expense">Saída</option>
          </select>
        </div>
        
        <div *ngIf="errorMsg()" class="error-msg">{{ errorMsg() }}</div>

        <div class="drawer-actions">
          <button type="button" class="btn-cancel" (click)="toggleModal()">Cancelar</button>
          <button type="submit" class="btn-save" [disabled]="isSaving()">
            {{ isSaving() ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .font-mono {
      font-family: var(--font-mono);
    }
  
    .dashboard-container {
      padding: 2rem;
      min-height: 80vh;
      animation: fadeIn 0.5s ease-out;
    }

    .glass-panel {
      background: var(--project-bg-dim, rgba(255, 255, 255, 0.05));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 8px 32px var(--project-glow, rgba(0, 0, 0, 0.3));
      color: #fff;
      position: relative;
      border: 1px solid transparent;
      background-clip: padding-box;
    }
    
    .glass-panel::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      border-radius: 16px;
      padding: 1px;
      background: linear-gradient(135deg, var(--project-accent, #a855f7), transparent);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .header {
      margin-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-titles h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.8rem;
      background: linear-gradient(90deg, #a78bfa, #f472b6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-titles p {
      margin: 0;
      color: #aaa;
    }

    .btn-add {
      background: #a78bfa;
      color: white;
      border: none;
      padding: 0.8rem 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.3s;
    }
    
    .btn-add:hover {
      background: #8b5cf6;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 3rem;
      color: #aaa;
    }

    .spinner {
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top: 3px solid #a78bfa;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .chart-container {
      height: 250px;
      margin: 0 auto 2rem auto;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .glass-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .glass-table th, .glass-table td {
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .glass-table th {
      color: #888;
      font-weight: 500;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 1px;
    }

    .glass-table tbody tr {
      transition: background-color 0.2s;
    }

    .glass-table tbody tr:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }

    .text-right {
      text-align: right;
    }

    .badge {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .badge-income {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .badge-expense {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .text-income {
      color: #34d399;
      font-weight: 600;
    }

    .text-expense {
      color: #f87171;
      font-weight: 600;
    }

    /* Drawer Styles */
    .drawer-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 999;
    }

    .side-drawer {
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: 100%;
      max-width: 400px;
      background: rgba(20, 20, 30, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2rem;
      z-index: 1000;
      box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .side-drawer {
        max-width: 100vw;
      }
    }

    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 1rem;
    }

    .drawer-header h3 {
      margin: 0;
      color: #fff;
      font-size: 1.5rem;
    }

    .btn-close {
      background: transparent;
      border: none;
      color: #aaa;
      font-size: 2rem;
      cursor: pointer;
      line-height: 1;
      transition: color 0.2s;
    }
    .btn-close:hover { color: #fff; }

    form {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
      color: #ccc;
    }

    .form-group input, .form-group select {
      width: 100%;
      padding: 0.8rem;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: #fff;
      font-size: 1rem;
    }

    .form-group input:focus, .form-group select:focus {
      border-color: #a78bfa;
      outline: none;
    }

    .drawer-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: auto;
      padding-top: 2rem;
    }

    .btn-cancel {
      background: transparent;
      color: #aaa;
      border: none;
      cursor: pointer;
      padding: 0.8rem 1.2rem;
    }

    .btn-cancel:hover {
      color: #fff;
    }

    .btn-save {
      background: #646cff;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }

    .btn-save:hover:not(:disabled) {
      background: #535bf2;
    }
    
    .btn-save:disabled {
      background: #444;
      cursor: not-allowed;
    }

    .error-msg {
      color: #ff6b6b;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    .actions-cell {
      min-width: 100px;
    }

    .btn-icon {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 0.4rem;
      margin-left: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .btn-edit:hover {
      background: rgba(167, 139, 250, 0.2);
      border-color: rgba(167, 139, 250, 0.5);
      text-shadow: 0 0 8px rgba(167, 139, 250, 0.8);
      transform: scale(1.05);
    }

    .btn-delete:hover {
      background: rgba(248, 113, 113, 0.2);
      border-color: rgba(248, 113, 113, 0.5);
      text-shadow: 0 0 8px rgba(248, 113, 113, 0.8);
      transform: scale(1.05);
    }
  `]
})
export class FinanceDashboardComponent implements OnInit {
  @HostBinding('class') hostClass = 'theme-finance';
  
  transactions = signal<Transaction[]>([]);
  isLoading = signal<boolean>(true);
  
  showModal = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMsg = signal<string>('');
  editTxId = signal<number | null>(null);

  totalIncome = computed(() => 
    this.transactions().filter(t => this.isIncome(t.type)).reduce((acc, curr) => acc + curr.amount, 0)
  );

  totalExpense = computed(() => 
    this.transactions().filter(t => !this.isIncome(t.type)).reduce((acc, curr) => acc + curr.amount, 0)
  );

  chartData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    return {
      labels: ['Entradas', 'Saídas'],
      datasets: [
        {
          data: [this.totalIncome(), this.totalExpense()],
          backgroundColor: [
            'rgba(167, 139, 250, 0.8)', // Roxo
            'rgba(248, 113, 113, 0.8)'  // Vermelho
          ],
          borderColor: [
            'rgba(167, 139, 250, 1)',
            'rgba(248, 113, 113, 1)'
          ],
          borderWidth: 1,
          hoverOffset: 4
        }
      ]
    };
  });

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#f8fafc',
          font: {
            size: 14,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }
        }
      }
    },
    cutout: '70%'
  };

  newTx: Omit<Transaction, 'id'> = {
    description: '',
    amount: null as any,
    date: new Date().toISOString().split('T')[0],
    type: 'Expense'
  };

  private financeService = inject(FinanceService);

  ngOnInit() {
    this.loadTransactions();
  }

  isIncome(type: string): boolean {
    if (!type) return false;
    const t = type.toLowerCase();
    return t === 'income' || t === 'receita';
  }

  loadTransactions() {
    this.isLoading.set(true);
    this.financeService.getTransactions().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar transações', err);
        this.isLoading.set(false);
      }
    });
  }

  toggleModal() {
    this.showModal.set(!this.showModal());
    this.errorMsg.set('');
    if (!this.showModal()) {
      setTimeout(() => this.resetForm(), 300); // delay para resetar o formulário após a animação
    } else if (!this.editTxId()) {
      this.resetForm();
    }
  }

  resetForm() {
    this.editTxId.set(null);
    this.newTx = {
      description: '',
      amount: null as any,
      date: new Date().toISOString().split('T')[0],
      type: 'Expense'
    };
  }

  prepareEdit(t: Transaction) {
    this.editTxId.set(t.id);
    this.newTx = {
      description: t.description,
      amount: t.amount,
      date: t.date.split('T')[0],
      type: t.type
    };
    this.showModal.set(true);
    this.errorMsg.set('');
  }

  confirmDelete(id: number) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.financeService.deleteTransaction(id).subscribe({
        next: () => {
          this.transactions.update(txs => txs.filter(t => t.id !== id));
        },
        error: (err) => {
          console.error('Erro ao excluir:', err);
          alert('Não foi possível excluir a transação.');
        }
      });
    }
  }

  saveTransaction() {
    if (!this.newTx.description || !this.newTx.amount || !this.newTx.date || !this.newTx.type) {
      this.errorMsg.set('Preencha todos os campos obrigatórios.');
      return;
    }

    this.isSaving.set(true);
    this.errorMsg.set('');

    const currentEditId = this.editTxId();

    if (currentEditId) {
      this.financeService.updateTransaction(currentEditId, this.newTx).subscribe({
        next: () => {
          this.transactions.update(txs => txs.map(t => 
            t.id === currentEditId ? { id: currentEditId, ...this.newTx } : t
          ));
          this.isSaving.set(false);
          this.toggleModal();
        },
        error: (err) => {
          console.error('Erro ao atualizar:', err);
          this.errorMsg.set('Falha ao atualizar transação.');
          this.isSaving.set(false);
        }
      });
    } else {
      this.financeService.createTransaction(this.newTx).subscribe({
        next: (createdTx) => {
          this.transactions.update(txs => [...txs, createdTx]);
          this.isSaving.set(false);
          this.toggleModal();
        },
        error: (err) => {
          console.error('Erro ao salvar:', err);
          this.errorMsg.set('Falha ao salvar transação.');
          this.isSaving.set(false);
        }
      });
    }
  }
}
