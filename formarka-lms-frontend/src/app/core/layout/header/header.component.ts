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
          <a routerLink="/admin" routerLinkActive="active" *ngIf="authService.currentUser()?.role === 'admin' || authService.currentUser()?.role === 'teacher'">Administración</a>
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
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(15px);
      height: auto;
      min-height: 120px;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 20px rgba(78, 7, 103, 0.05);
      position: sticky;
      top: 0;
      z-index: 1000;
      font-family: var(--font-main);
      border-bottom: 1px solid rgba(78, 7, 103, 0.05);
      padding: 12px 0;
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
      transition: transform 0.3s ease;
    }

    .logo-area:hover {
      transform: scale(1.05);
    }

    .logo {
      height: 100px;
      width: auto;
      object-fit: contain;
    }

    .nav {
      display: flex;
      gap: 40px;
    }

    .nav a {
      text-decoration: none;
      color: var(--brand-black);
      font-weight: 700;
      transition: all 0.3s ease;
      font-size: 1rem;
      position: relative;
      padding: 8px 0;
    }

    .nav a:hover, .nav a.active {
      color: var(--brand-purple-deep);
    }

    .nav a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--brand-purple-deep), var(--brand-purple-light));
      border-radius: 50px;
      transition: width 0.3s ease;
    }

    .nav a:hover::after, .nav a.active::after {
      width: 100%;
    }

    .user-area {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #f8f2ff;
      padding: 6px 12px;
      padding-right: 20px;
      border-radius: 100px;
      border: 1.5px solid rgba(78, 7, 103, 0.05);
    }

    .user-name {
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--brand-black);
    }

    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 2.5px solid var(--brand-purple-light);
      background: var(--formarka-white);
      object-fit: cover;
    }

    .logout-btn {
      background: none;
      border: none;
      color: #ef4444;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 0;
      transition: color 0.2s;
    }

    .logout-btn:hover {
      color: #b91c1c;
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
