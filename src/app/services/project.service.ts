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
        title: 'Athlete: Gestão de Macros',
        description: 'Controle preciso de macronutrientes e calorias para otimizar seus resultados físicos e performance nos treinos.',
        technology: 'FastAPI',
        language: 'Python',
        infra: 'Docker / PostgreSQL',
        repoUrl: 'https://github.com/guilhermerondon/athlete-macro-api',
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80',
        previewUrl: 'assets/previews/fitness-api.webm'
      },
      {
        id: 2,
        title: 'Gestor Financeiro Pessoal',
        description: 'Organização inteligente de receitas e despesas com foco em segurança de dados e simplicidade na gestão do capital.',
        technology: '.NET 8',
        language: 'C#',
        infra: 'Azure / SQL Server',
        repoUrl: 'https://github.com/guilhermerondon/finance-core-ledger',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
        previewUrl: 'https://cdn.pixabay.com/video/2019/04/16/22754-330198083_tiny.mp4'
      },
      {
        id: 3,
        title: 'Monitor de Saúde de Infra',
        description: 'Acompanhamento em tempo real da disponibilidade dos seus serviços para garantir máxima estabilidade e performance.',
        technology: 'Gin',
        language: 'Go',
        infra: 'Performance / SQLite',
        repoUrl: 'https://github.com/guilhermerondon/infra-watchdog-go',
        imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80',
        previewUrl: 'https://cdn.pixabay.com/video/2023/11/09/188448-883017770_tiny.mp4'
      }
    ];
  }
}
