import { Component, signal, effect, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChangelogComponent } from './components/changelog/changelog.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ChangelogComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'frontend';
  currentTheme = signal<string>('');
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      if (url.includes('/finance')) {
        this.currentTheme.set('theme-finance');
      } else if (url.includes('/fitness')) {
        this.currentTheme.set('theme-fitness');
      } else if (url.includes('/status')) {
        this.currentTheme.set('theme-status');
      } else {
        this.currentTheme.set(''); // Volta ao padrão
      }
    });
  }
}
