import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../../core/models/course.model';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="course-card">
      <div class="card-image">
        <img [src]="course.thumbnailUrl" [alt]="course.title">
        <span class="category">{{ course.category }}</span>
      </div>
      <div class="card-content">
        <div class="card-header">
          <span class="level" [ngClass]="course.level">{{ course.level | titlecase }}</span>
          <span class="instructor">por {{ course.instructorName }}</span>
        </div>
        <h3>{{ course.title }}</h3>
        <p>{{ course.description }}</p>
        <div class="card-footer">
          <app-button variant="outline" (onClick)="onAction.emit(course.id)">
            Ver Curso
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .course-card {
      background: var(--formarka-white);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 1px solid rgba(128, 18, 246, 0.1);
    }

    .course-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 30px rgba(128, 18, 246, 0.12);
    }

    .card-image {
      position: relative;
      height: 200px;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .category {
      position: absolute;
      top: 16px;
      right: 16px;
      background: var(--formarka-primary);
      color: white;
      padding: 6px 14px;
      border-radius: 50px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .level {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 50px;
    }

    .level.básico { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .level.intermedio { background: #fffbeb; color: #92400e; border: 1px solid #fef3c7; }
    .level.avanzado { background: #fff1f2; color: #991b1b; border: 1px solid #fecdd3; }

    .instructor {
      font-size: 0.8rem;
      color: var(--formarka-text-muted);
      font-weight: 500;
    }

    h3 {
      font-size: 1.25rem;
      margin-bottom: 12px;
      line-height: 1.3;
      color: var(--formarka-text);
    }

    p {
      font-size: 0.95rem;
      color: var(--formarka-text-muted);
      margin-bottom: 24px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex-grow: 1;
      line-height: 1.6;
    }

    .card-footer {
      margin-top: auto;
    }
  `]
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course;
  @Output() onAction = new EventEmitter<string>();
}
