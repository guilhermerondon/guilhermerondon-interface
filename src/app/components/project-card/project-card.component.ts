import { ChangeDetectionStrategy, Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Project } from '../../models/project.model';
import { AuthService } from '../../services/auth.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
  
  isHovered = signal(false);
  private authService = inject(AuthService);
  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);

  navigateToProject() {
    this.analyticsService.trackClick(this.project.title);
    if (this.project.id === 2) {
      // Gestor Financeiro exige Login
      if (this.authService.getToken()) {
        this.router.navigate(['/finance']);
      } else {
        // Se não logado, faz login anônimo automático
        this.authService.loginDemonstrativo().subscribe({
          next: () => this.router.navigate(['/finance']),
          error: () => this.router.navigate(['/login']) // Fallback caso o endpoint falhe
        });
      }
    } else if (this.project.id === 1) {
      this.router.navigate(['/fitness-api']);
    } else if (this.project.id === 3) {
      this.router.navigate(['/status']);
    }
  }

  isVideo(url?: string): boolean {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm');
  }

  get languageBadgeClass(): string {
    const lang = this.project?.language?.toLowerCase() || this.project?.technology?.toLowerCase() || '';
    if (lang.includes('python')) return 'badge-python';
    if (lang.includes('c#') || lang.includes('csharp')) return 'badge-csharp';
    if (lang.includes('java')) return 'badge-java';
    if (lang.includes('go')) return 'badge-go';
    return 'badge-default';
  }

  get infraBadgeClass(): string {
    const infra = this.project?.infra?.toLowerCase() || '';
    if (infra.includes('docker')) return 'badge-docker';
    if (infra.includes('kubernetes')) return 'badge-kubernetes';
    if (infra.includes('azure')) return 'badge-azure';
    return '';
  }
}
