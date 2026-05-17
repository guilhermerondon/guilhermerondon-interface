import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.financeApiUrl}/api/Analytics`;

  trackClick(projectName: string) {
    // Fire and forget, no need to subscribe here, but the component should handle it or we can subscribe here.
    // If we subscribe here, it won't block the UI navigation.
    this.http.post(`${this.apiUrl}/click`, { projectName }).subscribe({
      next: () => console.log(`[Analytics] Tracked click for ${projectName}`),
      error: (err) => console.error(`[Analytics] Failed to track click:`, err)
    });
  }
}
