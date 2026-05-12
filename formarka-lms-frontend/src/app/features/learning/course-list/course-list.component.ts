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
    <div class="container">
      <div class="list-header">
        <h1>Explora nuestros cursos</h1>
        <p>Aprende diseño, marketing y fotografía para potenciar tu marca.</p>
      </div>

      <div class="filters">
        <button class="filter-btn active">Todos</button>
        <button class="filter-btn">Diseño</button>
        <button class="filter-btn">Marketing</button>
        <button class="filter-btn">Fotografía</button>
      </div>

      <div class="courses-grid" *ngIf="!isLoading; else loadingTemplate">
        <app-course-card 
          *ngFor="let course of courses" 
          [course]="course"
          (onAction)="goToCourse($event)">
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
    .list-header {
      margin-bottom: 40px;
      text-align: center;
    }

    .list-header h1 {
      font-size: 2.5rem;
      margin-bottom: 12px;
    }

    .list-header p {
      font-size: 1.1rem;
      color: var(--formarka-text-muted);
    }

    .filters {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 40px;
    }

    .filter-btn {
      padding: 8px 20px;
      border-radius: 20px;
      border: 1px solid #ddd;
      background: var(--formarka-white);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .filter-btn.active, .filter-btn:hover {
      background: var(--formarka-primary);
      color: var(--formarka-white);
      border-color: var(--formarka-primary);
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }

    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }

    .skeleton-card {
      height: 400px;
      background: #eee;
      border-radius: 12px;
      animation: pulse 1.5s infinite ease-in-out;
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
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
