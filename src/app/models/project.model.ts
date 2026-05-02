export interface Project {
  id: number;
  title: string;
  description: string;
  technology: 'Python' | 'C#' | 'Go' | string;
  language?: 'Python' | 'C#' | 'Java' | 'Go' | string;
  infra?: 'Docker' | 'Kubernetes' | 'Azure' | string;
  repoUrl: string;
  iconPath?: string; // Campo mantido para retrocompatibilidade com o ProjectCard
  imageUrl: string; // Imagem/GIF demonstrativo estático
  previewUrl?: string; // Vídeo (mp4/webm) ou GIF dinâmico no hover
}
