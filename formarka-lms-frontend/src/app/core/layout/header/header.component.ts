import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <header class="header">
      <div class="container header-content">
        <div class="logo-area" routerLink="/">
          <img src="logo.png" alt="Formarka Logo" class="logo" onerror="this.src='https://placehold.co/120x40/1a1a1a/f4f4f4?text=FORMARKA'">
        </div>
        
        <nav class="nav">
          <a routerLink="/courses" routerLinkActive="active">Catálogo</a>
          <a routerLink="/my-courses" routerLinkActive="active" *ngIf="authService.currentUser()">Mis Cursos</a>
          <a routerLink="/admin" routerLinkActive="active" *ngIf="authService.currentUser()?.role === 'admin'">Administración</a>
        </nav>

        <div class="user-area">
          <ng-container *ngIf="authService.currentUser() as user; else guest">
            <div class="user-profile">
              <span class="user-name">{{ user.name }}</span>
              <img [src]="user.photoUrl || 'default-avatar.png'" class="avatar" onerror="this.src='default-avatar.png'">
              <button class="logout-btn" (click)="logout()">Cerrar Sesión</button>
            </div>
          </ng-container>
          <ng-template #guest>
            <app-button variant="outline" routerLink="/auth/login">Iniciar Sesión</app-button>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: var(--formarka-white);
      height: var(--header-height);
      display: flex;
      align-items: center;
      box-shadow: 0 4px 12px rgba(128, 18, 246, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
      font-family: var(--font-main);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .logo-area {
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .logo {
      height: 40px;
    }

    .nav {
      display: flex;
      gap: 32px;
    }

    .nav a {
      text-decoration: none;
      color: var(--formarka-text);
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 1rem;
      position: relative;
    }

    .nav a:hover, .nav a.active {
      color: var(--formarka-primary);
    }

    .nav a.active::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--formarka-primary);
      border-radius: 50px;
    }

    .user-area {
      display: flex;
      align-items: center;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--formarka-text);
    }

    .avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 2px solid var(--formarka-primary);
      padding: 2px;
      background: var(--formarka-white);
    }

    .logout-btn {
      background: none;
      border: none;
      color: #ef4444;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: 600;
      padding: 0;
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
