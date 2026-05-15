import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-admin-course-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonComponent, FormFieldComponent],
  template: `
    <div class="container admin-edit-container animate-up">
      <div class="edit-header">
        <nav class="breadcrumb">
          <a routerLink="/admin/courses">Gestión de Cursos</a> 
          <span class="separator">/</span> 
          <span class="current">{{ isEditMode ? 'Editar' : 'Nuevo' }} Curso</span>
        </nav>
        <h1 class="text-gradient">{{ isEditMode ? 'Perfecciona tu Curso' : 'Crea una nueva Experiencia' }}</h1>
        <p class="subtitle">Define la estructura, contenido y recursos para tus estudiantes.</p>
      </div>

      <div class="edit-content">
        <form [formGroup]="courseForm" (ngSubmit)="saveCourse()" class="course-form">
          <!-- Información General -->
          <div class="form-card glass animate-up" style="animation-delay: 0.1s">
            <div class="card-header">
              <span class="step-num">1</span>
              <h3>Información General</h3>
            </div>
            
            <app-form-field 
              label="Título del Curso" 
              [control]="getControl('title')"
              placeholder="Ej. Branding Avanzado para Emprendedores">
            </app-form-field>

            <div class="form-row">
              <app-form-field 
                label="Categoría" 
                [control]="getControl('category')"
                placeholder="Ej. Estrategia">
              </app-form-field>

              <div class="form-field">
                <label class="label">Nivel de Dificultad</label>
                <div class="select-wrapper">
                  <select formControlName="level" class="select-input">
                    <option value="básico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-field">
              <label class="label">Descripción del Programa</label>
              <textarea 
                formControlName="description" 
                class="textarea-input" 
                rows="5"
                placeholder="¿Qué lograrán tus alumnos con este curso?">
              </textarea>
            </div>

            <div class="form-row">
              <app-form-field 
                label="URL Imagen de Portada" 
                [control]="getControl('thumbnailUrl')"
                placeholder="https://images.unsplash.com/...">
              </app-form-field>

              <app-form-field 
                label="Nombre del Instructor" 
                [control]="getControl('instructorName')"
                placeholder="Ej. Esteban Formarka">
              </app-form-field>
            </div>
          </div>

          <!-- Estructura de Módulos -->
          <div class="form-card glass animate-up" style="animation-delay: 0.2s">
            <div class="card-header flex-between">
              <div class="flex-align">
                <span class="step-num">2</span>
                <h3>Estructura del Curso</h3>
              </div>
              <button type="button" class="add-btn" (click)="addModule()">
                + Añadir Módulo
              </button>
            </div>

            <div formArrayName="modules" class="modules-list">
              <div *ngFor="let module of modules.controls; let i=index" [formGroupName]="i" class="module-item animate-up">
                <div class="module-main-row">
                  <div class="module-drag-handle">⋮⋮</div>
                  <input type="text" formControlName="title" placeholder="Título del Módulo" class="module-title-input">
                  <button type="button" class="delete-icon-btn" (click)="removeModule(i)" title="Eliminar Módulo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 3 21 3 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>

                <div formArrayName="lessons" class="lessons-list">
                  <div *ngFor="let lesson of getLessons(i).controls; let j=index" [formGroupName]="j" class="lesson-item">
                    <div class="lesson-row">
                      <div class="lesson-dot"></div>
                      <input type="text" formControlName="title" placeholder="Título de la lección" class="lesson-title-input">
                      <div class="lesson-type-tag">
                        <select formControlName="type">
                          <option value="video">📹 Video</option>
                          <option value="text">📄 Texto</option>
                          <option value="quiz">🧠 Quiz</option>
                          <option value="file">📁 Archivo</option>
                        </select>
                      </div>
                      <button type="button" class="lesson-remove" (click)="removeLesson(i, j)">×</button>
                    </div>
                  </div>
                  <button type="button" class="add-lesson-btn" (click)="addLesson(i)">
                    + Nueva Lección
                  </button>
                </div>
              </div>
              
              <div class="empty-modules" *ngIf="modules.length === 0">
                <p>Aún no has definido módulos. Divide tu curso en secciones lógicas.</p>
              </div>
            </div>
          </div>

          <div class="form-actions animate-up" style="animation-delay: 0.3s">
            <app-button variant="outline" type="button" routerLink="/admin/courses">
              Descartar
            </app-button>
            <app-button type="submit" [loading]="isSaving" [disabled]="courseForm.invalid">
              {{ isEditMode ? 'Guardar Cambios' : 'Publicar Curso' }}
            </app-button>
          </div>
        </form>

        <aside class="edit-sidebar animate-up" style="animation-delay: 0.2s">
          <div class="sidebar-card glass sticky-card">
            <h3>Estado de Publicación</h3>
            <div class="status-box" [class.is-published]="isPublished">
              <div class="status-indicator">
                <span class="pulse-dot"></span>
                <strong>{{ isPublished ? 'Publicado' : 'Borrador' }}</strong>
              </div>
              <p class="status-desc">
                {{ isPublished ? 'El curso es visible para todos los estudiantes.' : 'Solo tú puedes ver y editar este curso.' }}
              </p>
            </div>
            
            <app-button variant="outline" (onClick)="togglePublish()" class="full-width">
              {{ isPublished ? 'Desactivar Curso' : 'Activar Curso' }}
            </app-button>

            <div class="divider"></div>

            <h3>Resumen</h3>
            <div class="summary-stats">
              <div class="stat-item">
                <span class="stat-label">Módulos</span>
                <span class="stat-val">{{ modules.length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Lecciones</span>
                <span class="stat-val">{{ getTotalLessons() }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .admin-edit-container { padding: 40px 0; }
    .edit-header { margin-bottom: 40px; }
    .breadcrumb { font-size: 0.9rem; margin-bottom: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
    .breadcrumb a { color: var(--brand-purple-deep); text-decoration: none; }
    .breadcrumb .separator { color: #ccc; }
    .breadcrumb .current { color: var(--formarka-text-muted); }
    .edit-header h1 { font-size: 2.8rem; margin-bottom: 8px; }
    .subtitle { color: var(--formarka-text-muted); font-size: 1.1rem; }

    .edit-content { display: grid; grid-template-columns: 1fr 350px; gap: 40px; align-items: start; }

    .form-card { background: white; padding: 35px; border-radius: 32px; border: 1px solid rgba(78, 7, 103, 0.05); margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
    .card-header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; }
    .step-num { width: 32px; height: 32px; background: var(--brand-purple-deep); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; }
    .card-header h3 { margin: 0; font-size: 1.4rem; color: var(--brand-black); }
    .flex-between { justify-content: space-between; }
    .flex-align { display: flex; align-items: center; gap: 15px; }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .label { display: block; margin-bottom: 10px; font-weight: 700; color: var(--brand-black); font-size: 0.95rem; }
    
    .select-wrapper { position: relative; }
    .select-input, .textarea-input, .module-title-input, .lesson-title-input { 
      width: 100%; padding: 14px 20px; border: 1.5px solid #e2e8f0; border-radius: 14px; 
      font-size: 1rem; background: #fff; transition: all 0.3s; font-family: var(--font-main);
    }
    .select-input:focus, .textarea-input:focus { outline: none; border-color: var(--brand-purple-deep); box-shadow: 0 0 0 4px rgba(78, 7, 103, 0.05); }

    .add-btn { background: var(--brand-purple-light); color: var(--brand-purple-deep); border: none; padding: 8px 20px; border-radius: 100px; font-weight: 800; cursor: pointer; transition: all 0.3s; font-size: 0.9rem; }
    .add-btn:hover { transform: scale(1.05); filter: brightness(0.95); }

    .modules-list { display: flex; flex-direction: column; gap: 20px; }
    .module-item { background: #fafafa; border-radius: 20px; padding: 20px; border: 1.5px solid #eee; }
    .module-main-row { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
    .module-drag-handle { color: #ccc; cursor: grab; font-size: 1.2rem; }
    .module-title-input { font-weight: 800; border-color: transparent; background: transparent; padding: 10px; font-size: 1.1rem; }
    .module-title-input:focus { border-color: var(--brand-purple-light); background: #fff; }

    .lessons-list { margin-left: 40px; display: flex; flex-direction: column; gap: 10px; }
    .lesson-item { background: white; padding: 12px 18px; border-radius: 14px; border: 1px solid #eee; transition: all 0.2s; }
    .lesson-item:hover { border-color: var(--brand-purple-light); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
    .lesson-row { display: flex; align-items: center; gap: 12px; }
    .lesson-dot { width: 6px; height: 6px; background: var(--brand-purple-light); border-radius: 50%; }
    .lesson-title-input { border: none; background: transparent; padding: 5px; font-weight: 600; font-size: 0.95rem; }
    .lesson-type-tag select { border: none; background: #f0f0f0; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer; }
    .lesson-remove { background: none; border: none; color: #ccc; font-size: 1.2rem; cursor: pointer; }
    .lesson-remove:hover { color: #ef4444; }

    .add-lesson-btn { background: transparent; border: 1.5px dashed #ccc; color: var(--formarka-text-muted); padding: 10px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 0.85rem; transition: all 0.3s; width: fit-content; }
    .add-lesson-btn:hover { border-color: var(--brand-purple-deep); color: var(--brand-purple-deep); background: #fff; }

    .delete-icon-btn { background: transparent; border: none; color: #fca5a5; cursor: pointer; padding: 8px; transition: color 0.2s; }
    .delete-icon-btn:hover { color: #ef4444; }

    .form-actions { display: flex; justify-content: flex-end; gap: 20px; padding-top: 20px; }

    .sticky-card { position: sticky; top: 120px; padding: 30px; }
    .status-box { background: #f0f0f0; padding: 20px; border-radius: 20px; margin-bottom: 24px; border: 1.5px solid #eee; }
    .status-box.is-published { background: #00D80010; border-color: #00D80020; }
    .status-indicator { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; margin-bottom: 8px; }
    .status-indicator strong { color: var(--brand-black); }
    .pulse-dot { width: 10px; height: 10px; background: #94a3b8; border-radius: 50%; }
    .is-published .pulse-dot { background: var(--brand-green-vibrant); box-shadow: 0 0 0 rgba(0, 216, 0, 0.4); animation: pulse 2s infinite; }
    .status-desc { font-size: 0.85rem; color: var(--formarka-text-muted); margin: 0; line-height: 1.4; }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0px rgba(0, 216, 0, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(0, 216, 0, 0); }
      100% { box-shadow: 0 0 0 0px rgba(0, 216, 0, 0); }
    }

    .divider { height: 1px; background: #eee; margin: 25px 0; }
    .summary-stats { display: grid; gap: 12px; }
    .stat-item { display: flex; justify-content: space-between; font-weight: 600; font-size: 0.95rem; }
    .stat-label { color: var(--formarka-text-muted); }
    .stat-val { color: var(--brand-purple-deep); }
    .full-width { width: 100%; }

    @media (max-width: 1100px) { .edit-content { grid-template-columns: 1fr; } .sticky-card { position: relative; top: 0; } }
  `]
})
export class AdminCourseEditComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = false;
  isSaving = false;
  isPublished = true;
  courseId?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      level: ['básico', [Validators.required]],
      thumbnailUrl: ['', [Validators.required]],
      instructorName: ['', [Validators.required]],
      modules: this.fb.array([])
    });
  }

  get modules() {
    return this.courseForm.get('modules') as FormArray;
  }

  getLessons(moduleIndex: number) {
    return this.modules.at(moduleIndex).get('lessons') as FormArray;
  }

  getTotalLessons(): number {
    let total = 0;
    for (let i = 0; i < this.modules.length; i++) {
      total += this.getLessons(i).length;
    }
    return total;
  }

  addModule() {
    const moduleGroup = this.fb.group({
      id: [Math.random().toString(36).substring(2, 9)],
      title: ['', Validators.required],
      lessons: this.fb.array([])
    });
    this.modules.push(moduleGroup);
  }

  removeModule(index: number) {
    if (confirm('¿Eliminar este módulo y todas sus lecciones?')) {
      this.modules.removeAt(index);
    }
  }

  addLesson(moduleIndex: number) {
    const lessonGroup = this.fb.group({
      id: [Math.random().toString(36).substring(2, 9)],
      title: ['', Validators.required],
      type: ['video', Validators.required]
    });
    this.getLessons(moduleIndex).push(lessonGroup);
  }

  removeLesson(moduleIndex: number, lessonIndex: number) {
    this.getLessons(moduleIndex).removeAt(lessonIndex);
  }

  togglePublish() {
    this.isPublished = !this.isPublished;
  }

  getModuleControl(index: number, name: string): FormControl {
    return this.modules.at(index).get(name) as FormControl;
  }

  getLessonControl(moduleIndex: number, lessonIndex: number, name: string): FormControl {
    return this.getLessons(moduleIndex).at(lessonIndex).get(name) as FormControl;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.courseId = id;
      this.courseService.getCourse(id).subscribe(course => {
        if (course) {
          this.courseForm.patchValue({
            title: course.title,
            description: course.description,
            category: course.category,
            level: course.level,
            thumbnailUrl: course.thumbnailUrl,
            instructorName: course.instructorName
          });
          
          if (course.modules) {
            this.modules.clear();
            course.modules.forEach(m => {
              const moduleGroup = this.fb.group({
                id: [m.id],
                title: [m.title, Validators.required],
                lessons: this.fb.array(m.lessons.map(l => this.fb.group({
                  id: [l.id],
                  title: [l.title, Validators.required],
                  type: [l.type, Validators.required]
                })))
              });
              this.modules.push(moduleGroup);
            });
          }
        }
      });
    } else {
      // Initialize with one module for better UX
      this.addModule();
    }
  }

  getControl(name: string): FormControl {
    return this.courseForm.get(name) as FormControl;
  }

  saveCourse(): void {
    if (this.courseForm.invalid) return;

    this.isSaving = true;
    const courseData = this.courseForm.value;
    
    const obs = this.isEditMode && this.courseId 
      ? this.courseService.updateCourse(this.courseId, courseData)
      : this.courseService.createCourse(courseData);

    obs.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/admin/courses']);
      },
      error: () => {
        this.isSaving = false;
        alert('Ocurrió un error al guardar el curso.');
      }
    });
  }
}
