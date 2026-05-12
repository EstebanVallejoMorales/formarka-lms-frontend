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
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .course-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    .card-image {
      position: relative;
      height: 180px;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .category {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(26, 26, 26, 0.8);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .card-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .level {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .level.básico { background: #e3f2fd; color: #1976d2; }
    .level.intermedio { background: #fff3e0; color: #f57c00; }
    .level.avanzado { background: #fce4ec; color: #c2185b; }

    .instructor {
      font-size: 0.8rem;
      color: var(--formarka-text-muted);
    }

    h3 {
      font-size: 1.2rem;
      margin-bottom: 10px;
      line-height: 1.3;
    }

    p {
      font-size: 0.9rem;
      color: var(--formarka-text-muted);
      margin-bottom: 20px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex-grow: 1;
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
