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
              isCompleted: true, // This will be overwritten by progress tracking
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
  private LAST_ACTIVITY_KEY = 'f-lms-last-activity';

  /**
   * Fetches all courses, injecting current progress for each lesson.
   */
  getCourses(): Observable<Course[]> {
    console.log('Mock: Fetching all courses.');
    // Simulate API call
    // const API_ENDPOINT = '/api/courses'; // Example backend endpoint
    // return this.http.get<Course[]>(API_ENDPOINT).pipe(
    //   map(courses => this.injectProgress(courses)),
    //   delay(500)
    // );

    const coursesWithProgress = this.injectProgress(this.mockCourses);
    return of(coursesWithProgress).pipe(delay(500)); // Simulate network delay
  }

  /**
   * Fetches a single course by ID, injecting its progress.
   */
  getCourse(id: string): Observable<Course | undefined> {
    console.log(`Mock: Fetching course with ID: ${id}`);
    const course = this.mockCourses.find(c => c.id === id);
    
    // Simulate API call
    // const API_ENDPOINT = `/api/courses/${id}`; // Example backend endpoint
    // return this.http.get<Course>(API_ENDPOINT).pipe(
    //   map(courseData => this.injectProgress([courseData])[0]),
    //   delay(500)
    // );

    if (course) {
      const courseWithProgress = this.injectProgress([course])[0];
      return of(courseWithProgress).pipe(delay(500)); // Simulate network delay
    }
    return of(undefined).pipe(delay(500));
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
    const course = this.mockCourses.find(c => c.id === courseId);
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
