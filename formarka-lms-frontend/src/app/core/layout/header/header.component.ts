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
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .logo-area {
      cursor: pointer;
    }

    .logo {
      height: 32px;
    }

    .nav {
      display: flex;
      gap: 30px;
    }

    .nav a {
      text-decoration: none;
      color: var(--formarka-text);
      font-weight: 500;
      transition: color 0.3s ease;
      font-size: 0.95rem;
    }

    .nav a:hover, .nav a.active {
      color: var(--formarka-accent);
    }

    .user-area {
      display: flex;
      align-items: center;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-name {
      font-size: 0.9rem;
      font-weight: 600;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid var(--formarka-accent);
    }

    .logout-btn {
      background: none;
      border: none;
      color: #e74c3c;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: 500;
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
