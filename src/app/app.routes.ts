import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'finance', loadComponent: () => import('./pages/finance-dashboard/finance-dashboard.component').then(m => m.FinanceDashboardComponent), canActivate: [authGuard] },
  { path: 'projetos', loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent) },
  { path: 'status', loadComponent: () => import('./pages/infra-status/infra-status.component').then(m => m.InfraStatusComponent) },
  { path: 'fitness-api', loadComponent: () => import('./components/macro-calculator/macro-calculator.component').then(m => m.MacroCalculatorComponent) },
  { path: 'sobre', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: '**', redirectTo: '' }
];
