import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Project } from '../../models/project.model';

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
