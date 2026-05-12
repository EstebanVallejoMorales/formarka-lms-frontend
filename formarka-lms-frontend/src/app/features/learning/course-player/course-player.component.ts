import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../../../shared/pipes/safe.pipe';
import { Course, Lesson, Module } from '../../../core/models/course.model';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './course-player.component.html',
  styleUrl: './course-player.component.css'
})
export class CoursePlayerComponent implements OnInit {
  course?: Course;
  currentLesson?: Lesson;
  
  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    // Load mock course data
    this.courseService.getCourse('1').subscribe(course => {
      this.course = course;
      // Set the first lesson as default
      if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
        this.currentLesson = course.modules[0].lessons[0];
      }
    });
  }

  selectLesson(lesson: Lesson): void {
    this.currentLesson = lesson;
  }

  toggleModule(module: Module): void {
    module.isOpen = !module.isOpen;
  }

  markAsCompleted(): void {
    if (this.currentLesson) {
      this.currentLesson.isCompleted = true;
    }
  }
}
