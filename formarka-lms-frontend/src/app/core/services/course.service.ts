import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  // Mock data for the MVP
  private mockCourse: Course = {
    id: '1',
    title: 'Construye tu Marca desde Cero',
    description: 'Aprende los fundamentos del diseño de marca para emprendedores.',
    thumbnailUrl: 'assets/course-thumb.jpg',
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
            contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
            duration: '05:20',
            isCompleted: true
          },
          {
            id: 'l2',
            title: 'Psicología del color',
            type: 'video',
            contentUrl: 'https://www.youtube.com/embed/fH_OnJk6QqU',
            duration: '12:45'
          }
        ]
      },
      {
        id: 'm2',
        title: 'Módulo 2: Tipografía y Composición',
        lessons: [
          {
            id: 'l3',
            title: 'Eligiendo tu fuente ideal',
            type: 'video',
            contentUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
            duration: '08:15'
          }
        ]
      }
    ]
  };

  getCourse(id: string): Observable<Course> {
    // For MVP, we always return the mock course
    return of(this.mockCourse);
  }
}
