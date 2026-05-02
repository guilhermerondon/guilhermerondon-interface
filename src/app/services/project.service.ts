import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  getProjects(): Project[] {
    return [
      {
        id: 1,
        title: 'Fitness API',
        description: 'Foco em Pydantic e Lógica de Macros.',
        technology: 'FastAPI',
        language: 'Python',
        infra: 'Docker / PostgreSQL',
        repoUrl: 'https://github.com/guilhermerondon/api-fitness-py',
        imageUrl: 'assets/images/fitness-form.jpg',
        previewUrl: 'assets/previews/fitness-api.webm'
      },
      {
        id: 2,
        title: 'Finance Ledger',
        description: 'Repository Pattern, EF Core e Segurança com JWT.',
        technology: '.NET 8',
        language: 'C#',
        infra: 'Azure / SQL Server',
        repoUrl: 'https://github.com/guilhermerondon/api-finance-cs',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
        previewUrl: 'https://cdn.pixabay.com/video/2019/04/16/22754-330198083_tiny.mp4'
      },
      {
        id: 3,
        title: 'Uptime Monitor',
        description: 'Alta performance com Goroutines e monitoramento real-time.',
        technology: 'Gin',
        language: 'Go',
        infra: 'Performance / SQLite',
        repoUrl: 'https://github.com/guilhermerondon/api-uptime-go',
        imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80',
        previewUrl: 'https://cdn.pixabay.com/video/2023/11/09/188448-883017770_tiny.mp4'
      }
    ];
  }
}
