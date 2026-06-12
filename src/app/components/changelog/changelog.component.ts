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
    { data: 'Hoje', version: 'v1.2.0', tipo: 'Feature', texto: 'Adicionado Terminal Interativo dinâmico na seção Sobre Mim.' },
    { data: 'Ontem', version: 'v1.1.5', tipo: 'Security', texto: 'Implementação de Rate Limiting e Filtro de Bots (SecOps).' },
    { data: 'Recente', version: 'v1.1.0', tipo: 'Infra', texto: 'Otimização de DNS e blindagem de banco de dados no Supabase (RLS).' }
  ];

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }

  closePopup() {
    this.isPopupOpen = false;
  }
}
