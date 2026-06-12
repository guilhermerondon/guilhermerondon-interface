import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.scss'
})
export class ChangelogComponent {
  public isPopupOpen = false;

  public updates = [
    { data: 'Hoje', version: 'v1.2.0', tipo: 'Feature', texto: 'Lançamento do Web CLI Interativo, Menu Glassmorphism e Widget de Changelog global.' },
    { data: 'Recente', version: 'v1.1.5', tipo: 'Security', texto: 'Implementação de Rate Limiting (60 req/min) e Filtro Global contra Bots/Crawlers na API C#.' },
    { data: 'Anterior', version: 'v1.1.0', tipo: 'Backend', texto: 'Desenvolvimento da API Rest em ASP.NET Core, integração com PostgreSQL e conteinerização com Docker.' },
    { data: 'Legado', version: 'v1.0.0', tipo: 'Release', texto: 'Lançamento inicial da interface do portfólio construída em Angular com design system dark neon.' }
  ];

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }

  closePopup() {
    this.isPopupOpen = false;
  }
}
