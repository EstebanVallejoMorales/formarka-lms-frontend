import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <div class="container admin-container animate-up">
      <div class="admin-header">
        <div>
          <h1 class="text-gradient">Gestión de Cursos</h1>
          <p>Administra el catálogo de cursos, módulos y lecciones de Formarka.</p>
        </div>
        <app-button routerLink="/admin/courses/new">
          <span class="icon">+</span> Nuevo Curso
        </app-button>
      </div>

      <div class="table-card glass">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Categoría</th>
              <th>Nivel</th>
              <th>Estructura</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let course of courses; let i = index" class="animate-up" [style.animation-delay]="i * 0.1 + 's'">
              <td>
                <div class="course-cell">
                  <div class="thumb-wrapper">
                    <img [src]="course.thumbnailUrl" [alt]="course.title" class="course-thumb">
                  </div>
                  <div class="course-info">
                    <span class="course-title">{{ course.title }}</span>
                    <span class="course-instructor">{{ course.instructorName }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="category-tag">{{ course.category }}</span>
              </td>
              <td>
                <span class="level-badge" [ngClass]="course.level">{{ course.level }}</span>
              </td>
              <td>
                <div class="structure-info">
                  <span class="count">{{ course.modules?.length || 0 }}</span> módulos
                </div>
              </td>
              <td>
                <span class="status-pill published">
                  <span class="dot"></span> Activo
                </span>
              </td>
              <td class="actions-cell">
                <div class="action-group">
                  <button class="action-btn edit" [routerLink]="['/admin/courses', course.id, 'edit']" title="Editar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button class="action-btn delete" (click)="deleteCourse(course.id)" title="Eliminar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 3 21 3 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="empty-state" *ngIf="courses.length === 0">
          <p>No hay cursos registrados. Comienza creando uno nuevo.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 40px 0;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 40px;
    }

    .admin-header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }

    .admin-header p {
      color: var(--formarka-text-muted);
      font-size: 1.1rem;
      font-weight: 500;
    }

    .table-card {
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 15px 50px rgba(78, 7, 103, 0.08);
      border: 1px solid rgba(78, 7, 103, 0.05);
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    .admin-table th {
      padding: 24px;
      text-align: left;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--brand-purple-deep);
      font-weight: 800;
      border-bottom: 2px solid #f0f0f0;
      background: #fafafa;
    }

    .admin-table td {
      padding: 24px;
      border-bottom: 1px solid #f5f5f5;
      vertical-align: middle;
      transition: background 0.3s ease;
    }

    .admin-table tr:hover td {
      background: #fdfbff;
    }

    .course-cell {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .thumb-wrapper {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      overflow: hidden;
      flex-shrink: 0;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .course-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .course-title {
      display: block;
      font-weight: 800;
      color: var(--brand-black);
      font-size: 1.1rem;
      margin-bottom: 4px;
    }

    .course-instructor {
      font-size: 0.85rem;
      color: var(--formarka-text-muted);
      font-weight: 600;
    }

    .category-tag {
      background: #f0f0f0;
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--brand-purple-deep);
    }

    .level-badge {
      font-size: 0.75rem;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 100px;
      text-transform: uppercase;
    }

    .level-badge.básico { background: #E6FCE6; color: #008000; }
    .level-badge.intermedio { background: #FFF9E6; color: #B38600; }
    .level-badge.avanzado { background: #FCE6F3; color: #9B0058; }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .status-pill.published {
      background: #00D80015;
      color: #008000;
    }

    .dot {
      width: 8px;
      height: 8px;
      background: currentColor;
      border-radius: 50%;
    }

    .action-group {
      display: flex;
      gap: 12px;
    }

    .action-btn {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      border: 1.5px solid #eee;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      color: var(--formarka-text-muted);
    }

    .action-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 15px rgba(0,0,0,0.05);
    }

    .action-btn.edit:hover {
      color: var(--brand-purple-deep);
      border-color: var(--brand-purple-deep);
      background: var(--brand-purple-light);
    }

    .action-btn.delete:hover {
      color: #ef4444;
      border-color: #ef4444;
      background: #fee2e2;
    }

    .empty-state {
      padding: 60px;
      text-align: center;
      color: var(--formarka-text-muted);
      font-weight: 600;
    }
  `]
})
export class AdminCoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  deleteCourse(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este curso de forma permanente?')) {
      this.courseService.deleteCourse(id).subscribe(success => {
        if (success) {
          this.loadCourses();
        }
      });
    }
  }
}
