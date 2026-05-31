import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorService, ServiceStatus } from '../../core/services/monitor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-monitor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitor-dashboard.component.html',
  styleUrl: './monitor-dashboard.component.scss'
})
export class MonitorDashboardComponent implements OnInit, OnDestroy {
  private monitorService = inject(MonitorService);
  private sub!: Subscription;

  // Estado que vai controlar a UI
  liveData: ServiceStatus | null = null;

  ngOnInit() {
    this.sub = this.monitorService.getLiveStatus().subscribe({
      next: (data) => {
        this.liveData = data;
        console.log('Status ao vivo recebido:', data);
      },
      error: (err) => console.error('Erro no WebSocket:', err)
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
