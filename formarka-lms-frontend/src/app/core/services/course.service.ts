import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from '../models/course.model';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  // Mock data for the MVP
  private mockCourses: Course[] = [
    {
      id: '1',
      title: 'Construye tu Marca desde Cero',
      description: 'Aprende los fundamentos del diseño de marca para emprendedores.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800',
      category: 'Diseño',
      level: 'básico',
      instructorName: 'Esteban Formarka',
      modules: [
        {
          id: 'm1',
          title: 'Módulo 1: Introducción a la Identidad Visual',
          isOpen: true,
          lessons: [
            {
              id: 'l1',
              title: '¿Qué es una marca?',
              type: 'video',
              contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              duration: '05:20',
              isCompleted: true,
              resources: [
                { id: 'r1', title: 'Guía de Branding PDF', url: '#', type: 'pdf' },
                { id: 'r2', title: 'Plantillas de Diseño', url: '#', type: 'zip' }
              ]
            },
            {
              id: 'l2',
              title: 'Psicología del color',
              type: 'video',
              contentUrl: 'https://www.youtube.com/embed/fH_OnJk6QqU',
              duration: '12:45'
            },
            {
              id: 'l3',
              title: 'Evaluación de Introducción',
              type: 'quiz',
              quiz: {
                id: 'q1',
                title: 'Quiz: Identidad Visual',
                passingScore: 70,
                questions: [
                  {
                    id: 'q1_1',
                    text: '¿Cuál es el objetivo principal de una identidad visual?',
                    options: [
                      { id: 'a', text: 'Que se vea bonito' },
                      { id: 'b', text: 'Transmitir los valores y personalidad de la marca' },
                      { id: 'c', text: 'Copiar a la competencia' }
                    ],
                    correctOptionId: 'b'
                  },
                  {
                    id: 'q1_2',
                    text: '¿Qué sentimiento suele transmitir el color azul en diseño?',
                    options: [
                      { id: 'a', text: 'Peligro' },
                      { id: 'b', text: 'Confianza y profesionalismo' },
                      { id: 'c', text: 'Hambre' }
                    ],
                    correctOptionId: 'b'
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Estrategia de Contenido para Redes',
      description: 'Cómo crear contenido que conecte con tu audiencia.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
      category: 'Marketing',
      level: 'intermedio',
      instructorName: 'Maria Digital'
    },
    {
      id: '3',
      title: 'Fotografía de Producto con Celular',
      description: 'Haz que tus productos luzcan profesionales con tu smartphone.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      category: 'Fotografía',
      level: 'básico',
      instructorName: 'Lucas Photo'
    }
  ];

  private PROGRESS_KEY = 'f-lms-progress';

  getCourses(): Observable<Course[]> {
    // Inject progress into courses
    const progress = this.getAllProgress();
    const coursesWithProgress = this.mockCourses.map(course => {
      if (course.modules) {
        course.modules.forEach(m => {
          m.lessons.forEach(l => {
            l.isCompleted = progress[`${course.id}_${l.id}`] || false;
          });
        });
      }
      return course;
    });
    return of(coursesWithProgress).pipe(delay(500));
  }

  getCourse(id: string): Observable<Course | undefined> {
    const course = this.mockCourses.find(c => c.id === id);
    if (course) {
      const progress = this.getAllProgress();
      if (course.modules) {
        course.modules.forEach(m => {
          m.lessons.forEach(l => {
            l.isCompleted = progress[`${course.id}_${l.id}`] || false;
          });
        });
      }
    }
    return of(course).pipe(delay(500));
  }

  completeLesson(courseId: string, lessonId: string): void {
    const progress = this.getAllProgress();
    progress[`${courseId}_${lessonId}`] = true;
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
    
    // Also save last activity
    localStorage.setItem('f-lms-last-activity', JSON.stringify({
      courseId,
      lessonId,
      timestamp: new Date().toISOString()
    }));
  }

  private getAllProgress(): { [key: string]: boolean } {
    const data = localStorage.getItem(this.PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  }

  getCourseProgress(courseId: string): number {
    const course = this.mockCourses.find(c => c.id === courseId);
    if (!course || !course.modules) return 0;
    
    let totalLessons = 0;
    let completedLessons = 0;
    const progress = this.getAllProgress();

    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (progress[`${courseId}_${l.id}`]) completedLessons++;
      });
    });

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  }

  enroll(courseId: string): Observable<boolean> {
    console.log('Enrolling in course:', courseId);
    return of(true).pipe(delay(1000));
  }
}
