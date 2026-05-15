import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  template: `
    <div class="container animate-up">
      <div class="list-header">
        <h1 class="text-gradient">Explora nuestros cursos</h1>
        <p>Aprende las herramientas reales para construir una marca con criterio y coherencia.</p>
      </div>

      <div class="filters-container glass">
        <div class="filters">
          <button class="filter-btn active">Todos los Programas</button>
          <button class="filter-btn">Diseño de Marca</button>
          <button class="filter-btn">Estrategia Digital</button>
          <button class="filter-btn">Fotografía</button>
        </div>
      </div>

      <div class="courses-grid" *ngIf="!isLoading; else loadingTemplate">
        <app-course-card 
          *ngFor="let course of courses; let i = index" 
          [course]="course"
          (onAction)="goToCourse($event)"
          class="animate-up"
          [style.animation-delay]="i * 0.15 + 's'">
        </app-course-card>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-grid">
          <div class="skeleton-card" *ngFor="let i of [1,2,3]"></div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .container {
      padding: 60px 24px;
    }

    .list-header {
      margin-bottom: 60px;
      text-align: center;
    }

    .list-header h1 {
      font-size: 3.5rem;
      margin-bottom: 16px;
      letter-spacing: -1px;
    }

    .list-header p {
      font-size: 1.25rem;
      color: var(--formarka-text-muted);
      max-width: 700px;
      margin: 0 auto;
      font-weight: 500;
    }

    .filters-container {
      margin-bottom: 60px;
      padding: 10px;
      border-radius: 100px;
      display: inline-flex;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      border: 1px solid rgba(78, 7, 103, 0.1);
      background: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }

    .filters {
      display: flex;
      gap: 5px;
    }

    .filter-btn {
      padding: 12px 28px;
      border-radius: 100px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-weight: 700;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      color: var(--formarka-text-muted);
      font-family: var(--font-main);
      font-size: 0.95rem;
    }

    .filter-btn.active {
      background: var(--brand-purple-deep);
      color: var(--formarka-white);
      box-shadow: 0 8px 20px rgba(78, 7, 103, 0.2);
    }

    .filter-btn:hover:not(.active) {
      background: #f8f2ff;
      color: var(--brand-purple-deep);
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 40px;
    }

    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 40px;
    }

    .skeleton-card {
      height: 480px;
      background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      border-radius: 32px;
      animation: shimmer 2s infinite linear;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (max-width: 768px) {
      .list-header h1 { font-size: 2.5rem; }
      .filters-container { border-radius: 20px; display: flex; flex-wrap: wrap; }
      .filters { flex-direction: column; width: 100%; }
      .courses-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  isLoading = true;

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.isLoading = false;
      }
    });
  }

  goToCourse(id: string): void {
    this.router.navigate(['/courses', id]);
  }
}
