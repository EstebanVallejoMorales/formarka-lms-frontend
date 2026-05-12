import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <div class="course-detail-container" *ngIf="course">
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-content">
            <nav class="breadcrumb">
              <a routerLink="/courses">Cursos</a> / {{ course.category }}
            </nav>
            <h1>{{ course.title }}</h1>
            <p class="description">{{ course.description }}</p>
            
            <div class="meta-info">
              <div class="meta-item">
                <span class="label">Nivel</span>
                <span class="value">{{ course.level | titlecase }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Instructor</span>
                <span class="value">{{ course.instructorName }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Duración</span>
                <span class="value">4h 30m</span>
              </div>
            </div>

            <div class="actions">
              <app-button size="large" (onClick)="enroll()" [loading]="isEnrolling">
                Matricularme ahora
              </app-button>
              <span class="price">¡Acceso Premium incluido!</span>
            </div>
          </div>
          
          <div class="hero-image">
            <img [src]="course.thumbnailUrl" [alt]="course.title">
          </div>
        </div>
      </section>

      <section class="container content-grid">
        <div class="main-info">
          <h2>Acerca de este curso</h2>
          <p>En este curso aprenderás paso a paso cómo potenciar tu marca personal o comercial. Hemos diseñado este contenido pensando en emprendedores que buscan resultados profesionales con herramientas accesibles.</p>
          
          <div class="learning-points">
            <h3>Lo que aprenderás</h3>
            <ul>
              <li>Conceptos fundamentales de diseño y comunicación.</li>
              <li>Cómo aplicar la psicología del color a tu identidad.</li>
              <li>Estrategias prácticas para redes sociales.</li>
              <li>Optimización de recursos visuales.</li>
            </ul>
          </div>

          <div class="syllabus">
            <h3>Contenido del curso</h3>
            <div class="module-card" *ngFor="let module of course.modules">
              <div class="module-header">
                <h4>{{ module.title }}</h4>
                <span>{{ module.lessons.length }} lecciones</span>
              </div>
              <ul class="lesson-list">
                <li *ngFor="let lesson of module.lessons">
                  <span class="icon">▶</span>
                  {{ lesson.title }}
                  <span class="duration">{{ lesson.duration }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <aside class="sidebar">
          <div class="sticky-card">
            <h3>Garantía Formarka</h3>
            <p>Acceso de por vida a las actualizaciones del curso y soporte de la comunidad.</p>
            <hr>
            <div class="features">
              <div class="feature">✓ 100% Online</div>
              <div class="feature">✓ Certificado al finalizar</div>
              <div class="feature">✓ Recursos descargables</div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  `,
  styles: [`
    .course-detail-container {
      background: var(--formarka-white);
    }

    .hero {
      background: var(--formarka-primary);
      color: var(--formarka-white);
      padding: 60px 0;
      margin-bottom: 60px;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }

    .breadcrumb {
      font-size: 0.9rem;
      margin-bottom: 20px;
      opacity: 0.8;
    }

    .breadcrumb a {
      color: var(--formarka-white);
      text-decoration: none;
    }

    .hero h1 {
      color: var(--formarka-white);
      font-size: 3rem;
      margin-bottom: 20px;
      line-height: 1.1;
    }

    .description {
      font-size: 1.2rem;
      margin-bottom: 30px;
      opacity: 0.9;
    }

    .meta-info {
      display: flex;
      gap: 40px;
      margin-bottom: 40px;
    }

    .meta-item .label {
      display: block;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.7;
      margin-bottom: 5px;
    }

    .meta-item .value {
      font-weight: 600;
      font-size: 1.1rem;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .price {
      color: var(--formarka-accent);
      font-weight: 700;
      font-size: 1.1rem;
    }

    .hero-image img {
      width: 100%;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 60px;
      padding-bottom: 80px;
    }

    h2, h3 {
      margin-bottom: 24px;
    }

    .main-info p {
      font-size: 1.1rem;
      color: var(--formarka-text);
      margin-bottom: 40px;
    }

    .learning-points {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 40px;
    }

    .learning-points ul {
      list-style: none;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .learning-points li::before {
      content: '✓';
      color: var(--formarka-accent);
      margin-right: 10px;
      font-weight: bold;
    }

    .module-card {
      border: 1px solid #eee;
      border-radius: 8px;
      margin-bottom: 15px;
      overflow: hidden;
    }

    .module-header {
      background: #f5f5f5;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .module-header h4 {
      margin: 0;
    }

    .lesson-list {
      list-style: none;
    }

    .lesson-list li {
      padding: 12px 20px;
      border-top: 1px solid #eee;
      display: flex;
      align-items: center;
      font-size: 0.95rem;
    }

    .lesson-list li .icon {
      margin-right: 15px;
      color: var(--formarka-text-muted);
      font-size: 0.8rem;
    }

    .duration {
      margin-left: auto;
      color: var(--formarka-text-muted);
      font-size: 0.85rem;
    }

    .sticky-card {
      position: sticky;
      top: 100px;
      background: var(--formarka-white);
      border: 1px solid #eee;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }

    .sticky-card hr {
      margin: 20px 0;
      border: 0;
      border-top: 1px solid #eee;
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .feature {
      font-size: 0.9rem;
      font-weight: 500;
    }

    @media (max-width: 992px) {
      .hero-grid, .content-grid {
        grid-template-columns: 1fr;
      }
      
      .hero-image {
        order: -1;
      }
      
      .hero h1 {
        font-size: 2.2rem;
      }
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  course?: Course;
  isEnrolling = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseService.getCourse(id).subscribe(course => {
        this.course = course;
      });
    }
  }

  enroll(): void {
    if (!this.course) return;
    
    this.isEnrolling = true;
    this.courseService.enroll(this.course.id).subscribe({
      next: () => {
        this.isEnrolling = false;
        // After enrollment, go to the player
        this.router.navigate(['/learning', this.course?.id]);
      },
      error: () => {
        this.isEnrolling = false;
        alert('Hubo un error al matricularte. Inténtalo de nuevo.');
      }
    });
  }
}
