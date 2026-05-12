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
    <div class="container admin-edit-container">
      <div class="edit-header">
        <nav class="breadcrumb">
          <a routerLink="/admin/courses">Gestión de Cursos</a> / {{ isEditMode ? 'Editar' : 'Nuevo' }} Curso
        </nav>
        <h1>{{ isEditMode ? 'Editar Curso' : 'Crear Nuevo Curso' }}</h1>
      </div>

      <div class="edit-content">
        <form [formGroup]="courseForm" (ngSubmit)="saveCourse()" class="course-form">
          <div class="form-section shadow-sm">
            <h3>Información General</h3>
            
            <app-form-field 
              label="Título del Curso" 
              [control]="getControl('title')"
              placeholder="Ej. Construye tu Marca desde Cero">
            </app-form-field>

            <div class="form-row">
              <app-form-field 
                label="Categoría" 
                [control]="getControl('category')"
                placeholder="Ej. Diseño">
              </app-form-field>

              <div class="form-field">
                <label class="label">Nivel</label>
                <select formControlName="level" class="select-input">
                  <option value="básico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <div class="form-field">
              <label class="label">Descripción</label>
              <textarea 
                formControlName="description" 
                class="textarea-input" 
                rows="4"
                placeholder="Describe de qué trata el curso...">
              </textarea>
            </div>

            <app-form-field 
              label="URL de Imagen de Portada" 
              [control]="getControl('thumbnailUrl')"
              placeholder="https://...">
            </app-form-field>

            <app-form-field 
              label="Nombre del Instructor" 
              [control]="getControl('instructorName')"
              placeholder="Ej. Esteban Formarka">
            </app-form-field>
          </div>

          <div class="form-section shadow-sm">
            <div class="section-header">
              <h3>Estructura del Curso (Módulos)</h3>
              <app-button variant="outline" size="small" type="button" (onClick)="addModule()">+ Añadir Módulo</app-button>
            </div>

            <div formArrayName="modules" class="modules-array">
              <div *ngFor="let module of modules.controls; let i=index" [formGroupName]="i" class="module-item-form">
                <div class="module-row">
                  <app-form-field label="Título del Módulo" [control]="getModuleControl(i, 'title')" class="flex-grow"></app-form-field>
                  <button type="button" class="delete-btn" (click)="removeModule(i)">🗑</button>
                </div>

                <div formArrayName="lessons" class="lessons-array">
                  <div *ngFor="let lesson of getLessons(i).controls; let j=index" [formGroupName]="j" class="lesson-item-form">
                    <div class="lesson-row">
                      <app-form-field label="Lección {{j+1}}" [control]="getLessonControl(i, j, 'title')" class="flex-3"></app-form-field>
                      <div class="form-field flex-1">
                        <label class="label">Tipo</label>
                        <select formControlName="type" class="select-input">
                          <option value="video">Video</option>
                          <option value="text">Texto</option>
                          <option value="quiz">Quiz</option>
                        </select>
                      </div>
                      <button type="button" class="delete-btn" (click)="removeLesson(i, j)">×</button>
                    </div>
                  </div>
                  <button type="button" class="add-lesson-link" (click)="addLesson(i)">+ Añadir Lección</button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <app-button variant="outline" type="button" routerLink="/admin/courses">
              Cancelar
            </app-button>
            <app-button type="submit" [loading]="isSaving" [disabled]="courseForm.invalid">
              {{ isEditMode ? 'Guardar Cambios' : 'Crear Curso' }}
            </app-button>
          </div>
        </form>

        <aside class="edit-sidebar" *ngIf="isEditMode">
          <div class="sidebar-card shadow-sm">
            <h3>Estado del Curso</h3>
            <div class="status-info">
              <span class="status-label">Estado:</span>
              <span class="status-value published">Publicado</span>
            </div>
            <app-button variant="outline" size="small" class="full-width">
              Despublicar Curso
            </app-button>
          </div>

          <div class="sidebar-card shadow-sm">
            <h3>Acciones Rápidas</h3>
            <ul class="quick-links">
              <li><a href="#">Ver como Estudiante</a></li>
              <li><a href="#">Estadísticas</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .admin-edit-container { padding: 20px; }
    .edit-header { margin-bottom: 30px; }
    .breadcrumb { font-size: 0.9rem; color: var(--formarka-text-muted); margin-bottom: 10px; }
    .breadcrumb a { color: var(--formarka-accent); text-decoration: none; font-weight: 600; }
    .edit-content { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
    .form-section { background: var(--formarka-white); padding: 30px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 30px; }
    .form-section h3 { margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #f5f5f5; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .label { display: block; margin-bottom: 8px; font-weight: 500; color: var(--formarka-primary); font-size: 0.9rem; }
    .select-input, .textarea-input { width: 100%; padding: 12px 16px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; background: var(--formarka-white); }
    .select-input:focus, .textarea-input:focus { outline: none; border-color: var(--formarka-accent); }
    .form-actions { display: flex; justify-content: flex-end; gap: 15px; }
    .sidebar-card { background: var(--formarka-white); padding: 25px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 20px; }
    .sidebar-card h3 { font-size: 1.1rem; margin-bottom: 20px; }
    .status-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .status-value.published { color: #2e7d32; font-weight: 700; }
    .full-width { width: 100%; }
    .quick-links { list-style: none; }
    .quick-links li { margin-bottom: 12px; }
    .quick-links a { color: var(--formarka-text); text-decoration: none; font-size: 0.95rem; transition: color 0.2s; }
    .quick-links a:hover { color: var(--formarka-accent); }

    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .module-item-form { border: 1px solid #eee; border-radius: 8px; padding: 20px; margin-bottom: 20px; background: #fafafa; }
    .module-row { display: flex; gap: 15px; align-items: flex-end; }
    .flex-grow { flex-grow: 1; }
    .lesson-item-form { margin-left: 30px; padding: 10px; border-left: 2px solid #ddd; margin-bottom: 10px; }
    .lesson-row { display: flex; gap: 15px; align-items: flex-end; }
    .flex-3 { flex: 3; }
    .flex-1 { flex: 1; }
    .delete-btn { background: none; border: 1px solid #ffcdd2; color: #d32f2f; padding: 8px; border-radius: 4px; cursor: pointer; margin-bottom: 20px; }
    .add-lesson-link { background: none; border: none; color: var(--formarka-accent); font-weight: 600; cursor: pointer; margin-left: 30px; font-size: 0.9rem; margin-bottom: 10px; display: inline-block; }

    @media (max-width: 992px) { .edit-content { grid-template-columns: 1fr; } }
  `]
})
export class AdminCourseEditComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = false;
  isSaving = false;
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

  addModule() {
    const moduleGroup = this.fb.group({
      title: ['', Validators.required],
      lessons: this.fb.array([])
    });
    this.modules.push(moduleGroup);
  }

  removeModule(index: number) {
    this.modules.removeAt(index);
  }

  addLesson(moduleIndex: number) {
    const lessonGroup = this.fb.group({
      title: ['', Validators.required],
      type: ['video', Validators.required]
    });
    this.getLessons(moduleIndex).push(lessonGroup);
  }

  removeLesson(moduleIndex: number, lessonIndex: number) {
    this.getLessons(moduleIndex).removeAt(lessonIndex);
  }

  getModuleControl(index: number, name: string): FormControl {
    return this.modules.at(index).get(name) as FormControl;
  }

  getLessonControl(moduleIndex: number, lessonIndex: number, name: string): FormControl {
    return this.getLessons(moduleIndex).at(lessonIndex).get(name) as FormControl;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
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
                title: [m.title, Validators.required],
                lessons: this.fb.array(m.lessons.map(l => this.fb.group({
                  title: [l.title, Validators.required],
                  type: [l.type, Validators.required]
                })))
              });
              this.modules.push(moduleGroup);
            });
          }
        }
      });
    }
  }

  getControl(name: string): FormControl {
    return this.courseForm.get(name) as FormControl;
  }

  saveCourse(): void {
    if (this.courseForm.invalid) return;

    this.isSaving = true;
    console.log('Saving course data:', this.courseForm.value);
    
    // Mock save
    setTimeout(() => {
      this.isSaving = false;
      this.router.navigate(['/admin/courses']);
    }, 1000);
  }
}
