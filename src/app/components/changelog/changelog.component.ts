import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.scss'
})
export class ChangelogComponent implements OnInit {
  public isPopupOpen = false;
  public updates: any[] = [];
  
  private http = inject(HttpClient);
  private datePipe = inject(DatePipe);

  ngOnInit(): void {
    this.fetchCommits();
  }

  fetchCommits(): void {
    this.http.get<any[]>('https://api.github.com/repos/guilhermerondon/guilhermerondon-interface/commits?per_page=5')
      .subscribe({
        next: (commits) => {
          this.updates = commits.map(item => {
            const message = item.commit.message;
            let tipo = 'Atualização';
            let cssClass = 'default';
            
            const lowerMsg = message.toLowerCase();
            if (lowerMsg.startsWith('feat')) {
              tipo = 'Feature';
              cssClass = 'feature';
            } else if (lowerMsg.startsWith('fix') || lowerMsg.startsWith('bugfix')) {
              tipo = 'Bugfix';
              cssClass = 'bugfix';
            } else if (lowerMsg.startsWith('style') || lowerMsg.startsWith('ui')) {
              tipo = 'UI/UX';
              cssClass = 'ui-ux';
            } else if (lowerMsg.startsWith('refactor')) {
              tipo = 'Refactor';
              cssClass = 'refactor';
            } else if (lowerMsg.startsWith('docs')) {
              tipo = 'Docs';
              cssClass = 'docs';
            } else if (lowerMsg.startsWith('chore')) {
              tipo = 'Chore';
              cssClass = 'chore';
            }
            
            return {
              data: this.datePipe.transform(item.commit.author.date, 'dd/MM/yyyy') || 'Recente',
              version: item.sha.substring(0, 7),
              tipo: tipo,
              cssClass: cssClass,
              texto: message
            };
          });
        },
        error: (err) => {
          console.error('Failed to fetch github commits', err);
          // Fallback just in case API fails
          this.updates = [
            { data: 'Hoje', version: 'v1.2.0', tipo: 'Feature', cssClass: 'feature', texto: 'Lançamento do Web CLI Interativo, Menu Glassmorphism e Widget de Changelog global.' }
          ];
        }
      });
  }

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }

  closePopup() {
    this.isPopupOpen = false;
  }
}
