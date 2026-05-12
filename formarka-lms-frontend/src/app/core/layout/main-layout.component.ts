import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <div class="layout-container">
      <app-header></app-header>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
      <footer class="footer">
        <div class="container">
          <p>&copy; 2026 Formarka LMS. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .content {
      flex: 1;
      padding: 40px 0;
    }

    .footer {
      background: var(--formarka-primary);
      color: var(--formarka-white);
      padding: 30px 0;
      text-align: center;
      font-size: 0.9rem;
    }
  `]
})
export class MainLayoutComponent {}
