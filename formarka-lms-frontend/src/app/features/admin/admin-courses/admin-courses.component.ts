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
    <div class="container admin-container">
      <div class="admin-header">
        <div>
          <h1>Gestión de Cursos</h1>
          <p>Administra el catálogo de cursos, módulos y lecciones.</p>
        </div>
        <app-button routerLink="/admin/courses/new">
          + Nuevo Curso
        </app-button>
      </div>

      <div class="table-container shadow-sm">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Categoría</th>
              <th>Nivel</th>
              <th>Módulos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let course of courses">
              <td>
                <div class="course-cell">
                  <img [src]="course.thumbnailUrl" [alt]="course.title" class="course-thumb">
                  <div class="course-info">
                    <span class="course-title">{{ course.title }}</span>
                    <span class="course-instructor">{{ course.instructorName }}</span>
                  </div>
                </div>
              </td>
              <td>{{ course.category }}</td>
              <td>
                <span class="badge" [ngClass]="course.level">{{ course.level }}</span>
              </td>
              <td>{{ course.modules?.length || 0 }} módulos</td>
              <td>
                <span class="status-pill published">Publicado</span>
              </td>
              <td class="actions-cell">
                <button class="icon-btn edit" [routerLink]="['/admin/courses', course.id, 'edit']" title="Editar">
                  ✎
                </button>
                <button class="icon-btn delete" (click)="deleteCourse(course.id)" title="Eliminar">
                  🗑
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .admin-header h1 {
      margin-bottom: 5px;
    }

    .admin-header p {
      color: var(--formarka-text-muted);
    }

    .table-container {
      background: var(--formarka-white);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #eee;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .admin-table th {
      background: #f8f9fa;
      padding: 15px 20px;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--formarka-text-muted);
      border-bottom: 1px solid #eee;
    }

    .admin-table td {
      padding: 15px 20px;
      border-bottom: 1px solid #f5f5f5;
      vertical-align: middle;
    }

    .course-cell {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .course-thumb {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      object-fit: cover;
    }

    .course-title {
      display: block;
      font-weight: 600;
      color: var(--formarka-primary);
    }

    .course-instructor {
      font-size: 0.8rem;
      color: var(--formarka-text-muted);
    }

    .badge {
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .badge.básico { background: #e3f2fd; color: #1976d2; }
    .badge.intermedio { background: #fff3e0; color: #f57c00; }
    .badge.avanzado { background: #fce4ec; color: #c2185b; }

    .status-pill {
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 12px;
      font-weight: 600;
    }

    .status-pill.published {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .actions-cell {
      display: flex;
      gap: 10px;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .icon-btn:hover {
      background: #f5f5f5;
    }

    .icon-btn.edit:hover {
      color: var(--formarka-accent);
      border-color: var(--formarka-accent);
    }

    .icon-btn.delete:hover {
      color: #d32f2f;
      border-color: #d32f2f;
    }
  `]
})
export class AdminCoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  deleteCourse(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      // Mock delete
      this.courses = this.courses.filter(c => c.id !== id);
    }
  }
}
