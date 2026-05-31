import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

export interface ServiceStatus {
  service: string;
  status: 'online' | 'offline' | 'degraded';
  latency_ms: number;
}

@Injectable({ providedIn: 'root' })
export class MonitorService {
  private socket$: WebSocketSubject<ServiceStatus>;

  constructor() {
    // Apontando para o seu servidor Go local (ajuste a URL para prod depois)
    this.socket$ = webSocket('ws://localhost:8080/ws/monitor');
  }

  // Retorna o fluxo de dados em tempo real
  getLiveStatus(): Observable<ServiceStatus> {
    return this.socket$.asObservable();
  }

  // Método opcional para fechar a conexão se o usuário sair da página
  closeConnection() {
    this.socket$.complete();
  }
}
