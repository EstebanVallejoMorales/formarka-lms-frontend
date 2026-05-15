import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course, Resource } from '../models/course.model';
import { delay } from 'rxjs/operators';

/**
 * Course Service
 * 
 * Provides mock data for courses and handles course-related operations.
 * 
 * NOTE: This service currently uses mock data for demonstration purposes.
 * In a production environment, these methods would use HttpClient
 * to communicate with a backend API for course data and progress tracking.
 */
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  // Mock data for the MVP - Moved to a private member that can be modified
  private _courses: Course[] = [
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
  private LAST_ACTIVITY_KEY = 'f-lms-last-activity';

  getCourses(): Observable<Course[]> {
    return of(this.injectProgress(this._courses)).pipe(delay(400));
  }

  getCourse(id: string): Observable<Course | undefined> {
    const course = this._courses.find(c => c.id === id);
    if (course) {
      return of(this.injectProgress([course])[0]).pipe(delay(300));
    }
    return of(undefined).pipe(delay(300));
  }

  // Course Management Logic
  createCourse(course: Course): Observable<Course> {
    const newCourse = { ...course, id: Math.random().toString(36).substring(2, 9) };
    this._courses.push(newCourse);
    return of(newCourse).pipe(delay(600));
  }

  updateCourse(id: string, course: Partial<Course>): Observable<Course | undefined> {
    const index = this._courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this._courses[index] = { ...this._courses[index], ...course };
      return of(this._courses[index]).pipe(delay(600));
    }
    return of(undefined).pipe(delay(300));
  }

  deleteCourse(id: string): Observable<boolean> {
    const initialLength = this._courses.length;
    this._courses = this._courses.filter(c => c.id !== id);
    return of(this._courses.length < initialLength).pipe(delay(500));
  }

  /**
   * Marks a lesson as completed and saves progress to localStorage.
   * Also updates last activity timestamp.
   */
  completeLesson(courseId: string, lessonId: string): void {
    console.log(`Mock: Completing lesson ${lessonId} in course ${courseId}.`);
    const progress = this.getAllProgress();
    progress[`${courseId}_${lessonId}`] = true;
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
    
    // Also save last activity
    localStorage.setItem(this.LAST_ACTIVITY_KEY, JSON.stringify({
      courseId,
      lessonId,
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Retrieves all saved progress data from localStorage.
   */
  private getAllProgress(): { [key: string]: boolean } {
    const data = localStorage.getItem(this.PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  }

  /**
   * Calculates the completion percentage for a given course.
   */
  getCourseProgress(courseId: string): number {
    const course = this._courses.find(c => c.id === courseId);
    if (!course || !course.modules) return 0;
    
    let totalLessons = 0;
    let completedLessons = 0;
    const progress = this.getAllProgress();

    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (progress[`${courseId}_${l.id}`]) {
          completedLessons++;
        }
      });
    });

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  }
  
  /**
   * Retrieves the last activity data.
   */
  getLastActivity(): Observable<{ courseId: string; lessonId: string; timestamp: string } | null> {
    console.log('Mock: Fetching last activity.');
    const data = localStorage.getItem(this.LAST_ACTIVITY_KEY);
    // Simulate API call
    // return this.http.get<{ courseId: string; lessonId: string; timestamp: string } | null>('/api/learning/last-activity').pipe(
    //   delay(300)
    // );
    return of(data ? JSON.parse(data) : null).pipe(delay(300)); // Simulate network delay
  }

  /**
   * Mocks course enrollment.
   */
  enroll(courseId: string): Observable<boolean> {
    console.log(`Mock: Enrolling in course: ${courseId}`);
    // Simulate API call
    // const API_ENDPOINT = '/api/learning/enroll'; // Example backend endpoint
    // return this.http.post<boolean>(API_ENDPOINT, { courseId }).pipe(
    //   delay(1000)
    // );
    return of(true).pipe(delay(1000)); // Simulate network delay
  }

  /**
   * Helper to inject current progress into a list of courses.
   */
  private injectProgress(courses: Course[]): Course[] {
    const progress = this.getAllProgress();
    return courses.map(course => {
      if (course.modules) {
        course.modules.forEach(m => {
          m.lessons.forEach(l => {
            l.isCompleted = progress[`${course.id}_${l.id}`] || false;
          });
        });
      }
      return course;
    });
  }
}
