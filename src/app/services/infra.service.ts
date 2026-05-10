import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Monitor {
  id: number;
  name: string;
  url: string;
  interval: number;
  current_status: string;
}

export interface UptimeLog {
  id: number;
  monitor_id: number;
  latency_ms: number;
  status_code: number;
  timestamp: string;
}

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfraService {
  private apiUrl = environment.watchdogApiUrl;
  private http = inject(HttpClient);

  getMonitors(): Observable<Monitor[]> {
    return this.http.get<Monitor[]>(`${this.apiUrl}/api/monitors`);
  }

  getMonitorHistory(id: number): Observable<UptimeLog[]> {
    return this.http.get<UptimeLog[]>(`${this.apiUrl}/api/monitors/${id}/history`);
  }
}
