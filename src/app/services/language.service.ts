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
      nav_home: "Home",
      nav_projects: "Projetos",
      nav_about: "Sobre"
    },
    en: {
      hero_title: "Software Architecture & Full Stack Development",
      hero_subtitle: "Systems Engineering focused on high-performance backends (Python, C#, Go) and modern interfaces in Angular.",
      btn_projects: "Explore Projects",
      btn_about: "About Me",
      terminal_command: "> guilhermerondon.getProfile()",
      nav_home: "Home",
      nav_projects: "Projects",
      nav_about: "About"
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
