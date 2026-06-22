import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public currentLang = signal<'pt' | 'en'>('pt');

  private translations = {
    pt: {
      hero_title: "Arquitetura de Software e Desenvolvimento Full Stack",
      hero_subtitle: "Engenharia de Sistemas focada em backends de alta performance (Python, C#, Go) e interfaces modernas em Angular.",
      btn_projects: "Explorar Projetos",
      btn_about: "Sobre Mim",
      terminal_command: "> guilhermerondon.getProfile()",
      nav_home: "Início",
      nav_projects: "Projetos",
      nav_about: "Sobre",
      hero_badge: "Sistemas Escaláveis & Alta Performance",
      about_title: "Sobre Mim",
      about_desc1: "Desenvolvedor Backend & Cloud focado em arquiteturas escaláveis. Minha trajetória envolve o domínio de linguagens como Python, C# e Go, com forte ênfase em containerização (Docker, Kubernetes) e ambientes de nuvem (Azure).",
      about_desc2: "Busco sempre aliar as melhores práticas de Engenharia de Software com interfaces que ofereçam uma excelente experiência ao usuário (UI/UX), entregando projetos Full Stack completos e performáticos.",
      tech_stack: "Tech Stack",
      projects_title: "Meus Projetos",
      projects_subtitle: "Conheça as soluções Full Stack que desenvolvi, com foco em arquitetura escalável e design moderno.",
      projects_btn_demo: "Ver Demo",
      macro_title: "Athlete Macro Analytics",
      macro_subtitle: "Calculadora de Macros conectada ao backend em Python (FastAPI).",
      macro_weight: "Peso (kg)",
      macro_height: "Altura (cm)",
      macro_age: "Idade",
      macro_goal: "Objetivo",
      macro_btn: "CALCULAR MACROS",
      back_to_projects: "Voltar para Projetos",
      macro_goal_loss: "Perda de Peso (Déficit)",
      macro_goal_maintain: "Manutenção",
      macro_goal_gain: "Ganho de Massa (Superávit)",
      macro_calculating: "Calculando...",
      macro_result_title: "Resultado Diário",
      macro_calories: "Calorias",
      macro_proteins: "Proteínas",
      macro_carbs: "Carboidratos",
      macro_fats: "Gorduras",
      macro_suggestion_title: "Recomendação Especial",
      macro_download_btn: "Baixar Dieta Completa",
      macro_downloading: "Gerando PDF...",
      projects_empty: "Nenhum projeto encontrado no momento.",
      // Project 1
      p1_title: "Athlete: Gestão de Macros",
      p1_desc: "Controle preciso de macronutrientes e calorias para otimizar seus resultados físicos e performance nos treinos.",
      // Project 2
      p2_title: "Gestor Financeiro Pessoal",
      p2_desc: "Organização inteligente de receitas e despesas com foco em segurança de dados e simplicidade na gestão do capital.",
      // Project 3
      p3_title: "Monitor de Saúde de Infra",
      p3_desc: "Acompanhamento em tempo real da disponibilidade dos seus serviços para garantir máxima estabilidade e performance.",
      finance_title: "Gestor Financeiro Pessoal",
      finance_subtitle: "Organização inteligente de receitas e despesas com foco em segurança de dados.",
      infra_title: "Monitor de Saúde de Infra",
      infra_subtitle: "Acompanhamento em tempo real da disponibilidade dos serviços para garantir máxima estabilidade."
    },
    en: {
      hero_title: "Software Architecture & Full Stack Development",
      hero_subtitle: "Systems Engineering focused on high-performance backends (Python, C#, Go) and modern interfaces in Angular.",
      btn_projects: "Explore Projects",
      btn_about: "About Me",
      terminal_command: "> guilhermerondon.getProfile()",
      nav_home: "Home",
      nav_projects: "Projects",
      nav_about: "About",
      hero_badge: "Scalable Systems & High Performance",
      about_title: "About Me",
      about_desc1: "Backend & Cloud Developer focused on scalable architectures. My background includes mastering languages like Python, C#, and Go, with a strong emphasis on containerization (Docker, Kubernetes) and cloud environments (Azure).",
      about_desc2: "I always seek to combine the best Software Engineering practices with interfaces that offer an excellent user experience (UI/UX), delivering complete and high-performance Full Stack projects.",
      tech_stack: "Tech Stack",
      projects_title: "My Projects",
      projects_subtitle: "Discover the Full Stack solutions I've developed, focusing on scalable architecture and modern design.",
      projects_btn_demo: "View Demo",
      macro_title: "Athlete Macro Analytics",
      macro_subtitle: "Macro Calculator connected to a Python backend (FastAPI).",
      macro_weight: "Weight (kg)",
      macro_height: "Height (cm)",
      macro_age: "Age",
      macro_goal: "Goal",
      macro_btn: "CALCULATE MACROS",
      back_to_projects: "Back to Projects",
      macro_goal_loss: "Weight Loss (Deficit)",
      macro_goal_maintain: "Maintenance",
      macro_goal_gain: "Muscle Gain (Surplus)",
      macro_calculating: "Calculating...",
      macro_result_title: "Daily Result",
      macro_calories: "Calories",
      macro_proteins: "Proteins",
      macro_carbs: "Carbs",
      macro_fats: "Fats",
      macro_suggestion_title: "Special Recommendation",
      macro_download_btn: "Download Complete Diet",
      macro_downloading: "Generating PDF...",
      projects_empty: "No projects found at the moment.",
      // Project 1
      p1_title: "Athlete: Macro Management",
      p1_desc: "Precise control of macronutrients and calories to optimize your physical results and training performance.",
      // Project 2
      p2_title: "Personal Finance Manager",
      p2_desc: "Intelligent organization of income and expenses focused on data security and capital management simplicity.",
      // Project 3
      p3_title: "Infra Health Monitor",
      p3_desc: "Real-time tracking of your services' availability to ensure maximum stability and performance.",
      finance_title: "Personal Finance Manager",
      finance_subtitle: "Smart organization of income and expenses focused on data security.",
      infra_title: "Infra Health Monitor",
      infra_subtitle: "Real-time tracking of service availability to ensure maximum stability."
    }
  };

  public text = computed(() => this.translations[this.currentLang()]);

  constructor() {
    const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';
    if (isBrowser) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.includes('en')) {
        this.currentLang.set('en');
      } else {
        this.currentLang.set('pt');
      }
    }
  }

  public toggleLanguage(): void {
    this.currentLang.set(this.currentLang() === 'pt' ? 'en' : 'pt');
  }
}
